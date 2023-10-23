export const findColor = (type?: string) => {
  let result;
  switch (type) {
    case "grass":
      result = "#78c850";
      break;
    case "normal":
      result = "#a8a878";
      break;
    case "fire":
      result = "#f08030";
      break;
    case "fighting":
      result = "#c03028";
      break;
    case "water":
      result = "#6890f0";
      break;
    case "flying":
      result = "#a890f0";
      break;
    case "poison":
      result = "#a040a0";
      break;
    case "electric":
      result = "#f8d030";
      break;
    case "ground":
      result = "#e0c068";
      break;
    case "psychic":
      result = "#f85888";
      break;
    case "rock":
      result = "#b8a038";
      break;
    case "ice":
      result = "#98d8d8";
      break;
    case "bug":
      result = "#a8b820";
      break;
    case "dragon":
      result = "#7038f8";
      break;
    case "ghost":
      result = "#705898";
      break;
    case "dark":
      result = "#705848";
      break;
    case "steel":
      result = "#b8b8d0";
      break;
    case "fairy":
      result = "#ee99ac";
      break;
    default:
      result = "#ffffff";
      break;
  }
  return result;
};
