import styled from 'styled-components';

export const DisplayGrid = styled.div`
    display: grid;
    grid-template-columns: auto 400px;
    height: 100vh;
    background: var(--chakra-colors-gray-800);

    & > .product-list {
        padding: 10px;
        border-right: 1px solid #111;
        overflow: auto;
    }

    & > .total-column {
        display: grid;
        overflow: none;
        grid-template-rows: 50px calc(80vh - 100px) calc(20vh - 50px) 100px;

        @media screen and (max-height: 768px) {
            grid-template-rows: calc(80vh - 100px) 20vh 100px;
        }

        & > div:first-child {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 10px;
            user-select: none;

            & > button > span {
                padding-top: 3px;
            }
        }

        & > div:nth-child(2) {
            padding: 10px;
            overflow: auto;
            background-color: var(--chakra-colors-gray-800);
        }

        & > div:nth-child(3) {
            text-align: center;
            background-color: #171d28;
            color: #fff;
            display: flex;
            -moz-box-align: center;
            align-items: center;
            -moz-box-pack: center;
            justify-content: center;
            user-select: none;

            & > h2 {
                margin-bottom: 0;
            }

            @media screen and (max-width: 1024px) {
                padding-top: 1vh;
            }

            @media screen and (max-width: 1280px) {
                & > h2 {
                    font-size: 75px;
                }
            }
        }

        & > div:last-child {
            display: flex;
            width: 100%;
            padding: 20px;
            background-color: #171d28;

            & > button.MuiButton-containedPrimary:not(:disabled)  {
                background-color: #287425;
            }

            & > button.MuiButton-containedPrimary:disabled {
                background-color: #6d6d6d;
            }

            & > button.MuiButton-containedSecondary:not(:disabled) {
                color: #fff;
                background-color: #821e1e;
            }

            & > button {
                width: 100%;
            }
        }
    }
`;

export const TotalProductList = styled.div`
    & > div:not(.hint) {
        /* cursor: pointer; */
        margin-bottom: 5px;
        user-select: none;
    }

    & > .hint{
        text-align: center;
        padding-top: 10px;
        user-select: none;
    }
`;