package main

import (
	"bytes"
	"encoding/base64"
	"encoding/hex"
	"errors"
	"io/ioutil"
	"os"
	"os/exec"
	"strconv"
	"text/template"
	"time"

	"github.com/phin1x/go-ipp"
	"github.com/skip2/go-qrcode"
	"github.com/wisepythagoras/pos-system/crypto"
)

// ReceiptTmplData describes the template data for the receipt.
type ReceiptTmplData struct {
	Total      float64
	Order      *OrderJSON
	Products   *[]AggregateProduct
	Qrcode     string
	Name       string
	Address1   string
	Address2   string
	DateString string
}

// Receipt describes the receipt object. It should contain an order and the config.
type Receipt struct {
	Order     *OrderJSON
	Total     float64
	Config    *Config
	Client    *ipp.IPPClient
	printerId int
}

// GetPrinter returns the index of the selected printer in the configuration array.
func (r *Receipt) GetPrinter() int {
	printerId := r.printerId

	if printerId <= 0 {
		printerId = 1
	}

	printerIdx := 0

	for i, p := range r.Config.Printers {
		if p.ID == printerId {
			printerIdx = i
			break
		}
	}

	return printerIdx
}

// ConnectToPrinter connects to the printer server.
func (r *Receipt) ConnectToPrinter() error {
	if len(r.Config.Printers) == 0 {
		return errors.New("No printers were specified in the config")
	}

	printerIdx := r.GetPrinter()

	// TODO: In order to support multiple printers, this should take a specific index.
	server := r.Config.Printers[printerIdx].Server
	port := r.Config.Printers[printerIdx].Port
	username := r.Config.Printers[printerIdx].Username
	password := r.Config.Printers[printerIdx].Password

	// Connect to the printer server.
	r.Client = ipp.NewIPPClient(server, port, username, password, true)

	return nil
}

// Print prints the receipt.
func (r *Receipt) Print() (int, error) {
	// Connect to the printer if the connection died.
	if r.Client.TestConnection() != nil {
		r.ConnectToPrinter()
	}

	// Create the file.
	data, err := ioutil.ReadFile("templates/receipt.html")

	if err != nil {
		return 99, err
	}

	t, err := template.New("receipt").Parse(string(data))

	if err != nil {
		return 99, err
	}

	fileName := "receipt-" + strconv.Itoa(int(r.Order.ID))

	// Create a file for the rendered receipt.
	receiptFile, err := os.OpenFile("receipts/"+fileName+".html", os.O_WRONLY|os.O_CREATE, 0600)

	if err != nil {
		return 99, err
	}

	defer receiptFile.Close()

	encryptJSON := `{"i": ` + strconv.Itoa(int(r.Order.ID)) + `}`
	encryptedId, _ := crypto.EncryptGCM([]byte(encryptJSON), []byte(r.Config.Key))
	hexEncryptedId := hex.EncodeToString(encryptedId)
	png, _ := qrcode.Encode(hexEncryptedId, qrcode.Medium, 160)

	// This is the new buffer that will contain the executedtemplate.
	buff := new(bytes.Buffer)

	var aggregateProducts []AggregateProduct
	var aggregateMap map[uint64]uint = make(map[uint64]uint)
	var products map[uint64]ProductJSON = make(map[uint64]ProductJSON)

	// Find how many of each products we have.
	for _, product := range r.Order.Products {
		if val, ok := aggregateMap[product.ID]; ok {
			aggregateMap[product.ID] = val + 1
		} else {
			aggregateMap[product.ID] = 1
			products[product.ID] = product
		}
	}

	// Now compose the aggregate product array.
	for productId, quantity := range aggregateMap {
		product := products[productId]
		aggregateProduct := AggregateProduct{
			Quantity: quantity,
			ID:       product.ID,
			Name:     product.Name,
			Price:    float64(quantity) * product.Price,
			Type:     product.Type,
		}

		aggregateProducts = append(aggregateProducts, aggregateProduct)
	}

	tmplData := ReceiptTmplData{
		Total:      r.Total,
		Order:      r.Order,
		Qrcode:     base64.StdEncoding.EncodeToString(png),
		Products:   &aggregateProducts,
		Name:       r.Config.Name,
		Address1:   r.Config.Address1,
		Address2:   r.Config.Address2,
		DateString: r.Order.CreatedAt.Format(time.RFC1123),
	}

	// Execute the receipt.
	err = t.Execute(buff, tmplData)

	receiptFile.WriteString(buff.String())

	cwd, _ := os.Getwd()

	input := cwd + "/receipts/" + fileName + ".html"
	output := cwd + "/receipts/" + fileName + ".pdf"

	// Now we want to convert the receipt to a PDF so that the printer can render it.
	cmd := exec.Command("wkhtmltopdf", "--page-width", "80", "--page-height", "200", input, output)
	err = cmd.Start()

	if err != nil {
		return 99, err
	}

	err = cmd.Wait()

	if err != nil {
		return 99, err
	}

	if len(r.Config.Printers) == 0 {
		return -1, errors.New("No printers are set up")
	}

	printerIdx := r.GetPrinter()
	printer := r.Config.Printers[printerIdx].Name

	// Finally, call the printer to print the receipt.
	return r.Client.PrintFile(output, printer, map[string]interface{}{})
}
