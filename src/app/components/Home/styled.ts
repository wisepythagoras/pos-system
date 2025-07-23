import styled from 'styled-components';

export const DisplayGrid = styled.div`
    display: grid;
    /* grid-template-columns: auto 400px; */
    /* background: var(--chakra-colors-gray-800); */
    background: #09090b;
    height: 100vh;

    @media screen and (min-width: 801px) {
        grid-template-columns: auto 400px;
        grid-template-rows: 100vh;
    }

    @media screen and (max-width: 800px) {
        grid-template-columns: 100vw;
        grid-template-rows: auto 300px;
    }

    & > .product-list {
        padding: 10px;
        border-right: 1px solid #111;
        overflow: auto;
    }

    & > .total-column {
        display: grid;
        overflow: none;
        grid-template-rows: 50px calc(80vh - 100px) auto;

        @media screen and (max-width: 800px) {
            grid-template-columns: calc(80vw - 100px) auto;
            grid-template-rows: 100vw;
            height: 300px;
        }

        @media screen and (max-height: 768px) {
            grid-template-rows: calc(80vh - 100px) 20vh 100px;
        }

        & > div:first-child {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 10px;
            user-select: none;

            @media screen and (max-width: 800px) {
                flex-direction: column;
                max-height: 300px;
                display: none;
            }

            & > button > span {
                padding-top: 3px;
            }
        }

        & > div:nth-child(2) {
            padding: 10px;
            overflow: auto;
            /* background: var(--chakra-colors-gray-800); */
            background: #09090b;

            @media screen and (max-width: 800px) {
                max-height: 300px;
            }
        }

        & > .action-info {
            display: flex;
            flex-direction: column;

            @media screen and (max-width: 800px) {
                max-height: 300px;
            }

            & > div:first-child {
                text-align: center;
                background-color: #171d28;
                color: #fff;
                display: flex;
                -moz-box-align: center;
                align-items: center;
                -moz-box-pack: center;
                justify-content: center;
                user-select: none;
                height: 100%;
                flex: 1;

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

                @media screen and (max-width: 800px) {
                    & > h2 {
                        font-size: 45px;
                    }
                }
            }

            & > div:last-child {
                display: flex;
                width: 100%;
                height: 100px;
                padding: 20px;
                background-color: #171d28;

                @media screen and (max-width: 800px) {
                    padding: 10px;
                }

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
    }
`;

export const TotalProductList = styled.div`
    & > div:not(.hint) {
        margin-bottom: 5px;
        user-select: none;
    }

    & > .hint{
        text-align: center;
        padding-top: 10px;
        user-select: none;
    }
`;