import styled from 'styled-components';

export const DoneCard = styled.div`
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #fff;
    opacity: 0.5;

    & > div {
        height: 100%;
    }

    h2.notice {
        color: #25a031;
        font-weight: bold;
        text-transform: uppercase;
        font-size: 80px;
    }
`;
