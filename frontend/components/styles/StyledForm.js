import styled from 'styled-components'

const StyledForm = styled.form`
  font-size: 1.5rem;
  line-height: 1.5;
  font-weight: bold;

  h2 {
    margin-bottom: 4rem;
    text-align: center;
  }

  label {
    display: grid;
    grid-template-rows: repeat(3, min-content);
    grid-row-gap: 0.5rem;

    p {
      font-size: 1rem;
      color: ${props => props.theme.red};
      font-style: italic;
    }
  }

  p.success {
    margin-top: 1rem;
    font-size: 1.2rem;
    color: ${props => props.theme.highlight_2};
  }

  p.error {
    margin-top: 1rem;
    font-size: 1rem;
    color: ${props => props.theme.red};
    font-style: italic;
  }

  fieldset {
    display: grid;
    grid-template-rows: repeat(4, min-content);
    grid-row-gap: 0.5rem;

    border: 0;
    padding: 0;

    &[disabled] {
      opacity: 0.5;
    }

    input {
      grid-row: 2;
    }
  }

  input,
  textarea,
  select {
    width: 100%;
    padding: 0.8rem;
    font-size: 1.2rem;
    border: 1px solid ${props => props.theme.border_2};
    border-radius: 2px;

    &:focus {
      outline: 0;
      border-color: ${props => props.theme.red};
    }
  }

  button,
  input[type='submit'] {
    width: 100%;
    background: ${props => props.theme.highlight};
    color: white;
    border: 0;
    font-size: 1.5rem;
    font-weight: 600;
    padding: 1rem 0;
    margin-top: 1.5rem;
    cursor: pointer;
  }
`

export default StyledForm
