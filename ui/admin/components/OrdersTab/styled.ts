import styled from 'styled-components';

export const ControlContainer = styled.div`
    margin-bottom: 15px;
    margin-top: 15px;
    flex: 1;
    display: flex;

    & > button {
        margin-right: 5px;
    }

    & > .divider {
        margin: 0 10px;
    }

    @media screen and (max-width: 768px) {
        flex-direction: column;

        & > div,
        & > button {
            margin-bottom: 5px;
            width: 100%;

            & input {
                height: 40px;
                width: 100%;
            }
        }

        & > .divider {
            display: none;
        }
    }
`;

export const GridRowBox = styled.div`
    display: grid;
    grid-template-columns: 25% 25% 25% 25%;
    margin-bottom: 15px;

    & > div:not(:last-child) {
        margin-right: 5px;
    }
`;

export const PaginationContainer = styled.div`
    padding: 10px;
    display: flex;
    justify-content: center;
`;
