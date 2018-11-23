import { Toast } from "native-base";

let showToastsInArr = function (arr, params = {}) {
  arr.forEach(message => {
    Toast.show({
      text: message,
      buttonText: params.buttonText || "OK",
      type: params.type || "danger",
      position: params.position || "top",
      duration: params.duration || 5000
    });
  });
};

export async function handleError(component, result) {
  if (result.ApiErr) {
    component.setState({ ApiErrors: result.ApiErr });
    showToastsInArr(result.ApiErr);
  }
}
