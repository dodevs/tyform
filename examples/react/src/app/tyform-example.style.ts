import styled from "@emotion/styled";

const errorColor = '#ff4b4b';

export const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 10px;

    max-width: 500px
`;

export const Label = styled.label`
    display: flex;
    flex-direction: column;
`;

export const Input = styled.input`
    margin-top: 5px;

    &.invalid {
        border: 0.1em solid ${errorColor};
    }
`;

export const Small = styled.small`
    color: ${errorColor};
`;

export const Button = styled.button`
    width: fit-content;
`;