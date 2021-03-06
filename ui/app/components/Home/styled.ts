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
        /* grid-template-rows: calc(80vh - 100px) 50px calc(20vh - 50px) 100px; */
        grid-template-rows: calc(80vh - 50px) calc(20vh - 50px) 100px;

        @media screen and (max-height: 768px) {
            grid-template-rows: calc(80vh - 100px) 20vh 100px;
        }

        & > div:first-child {
            padding: 10px;
            overflow: auto;
            background-color: var(--chakra-colors-gray-800);
        }

        & > div:nth-child(2) {
            text-align: center;
            border-top: 1px solid #11111160;
            background-color: #1a1a1a60;
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
                width: 50%;
                border-radius: 0;
            }
        }
    }
`;

export const TotalProductList = styled.div`
    & > div:not(.hint) {
        cursor: pointer;
        margin-bottom: 5px;
        user-select: none;
    }

    & > .hint{
        text-align: center;
        padding-top: 10px;
        user-select: none;
    }
`;