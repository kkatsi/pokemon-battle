import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
   @font-face {
     font-family: 'Pokemon';
     font-style: normal;
     src: local(''),
          url('./fonts/Pokemon.ttf') format('truetype'),
   }

      @font-face {
     font-family: 'Pokemon Text';
     font-style: normal;
     src: local(''),
          url('./fonts/Pokemon-text.ttf') format('truetype'),
   }

   `;

export default GlobalStyle;
