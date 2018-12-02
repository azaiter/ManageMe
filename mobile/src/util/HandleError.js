import { Toast } from "native-base";

export function showToastsInArr(arr, params = {}) {
  arr.forEach(message => {
    Toast.show({
      text: message,
      buttonText: params.buttonText || "OK",
      type: params.type || "danger",
      position: params.position || "top",
      duration: params.duration || 5000
    });
  });
}

export async function handleError(component, result) {
  var key = Object.keys(result);
  var value = Object.values(result);
  component.setState({ [key[0]]: value[0] });
  showToastsInArr(value[0]);
}
