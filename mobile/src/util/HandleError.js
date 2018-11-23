import { Toast } from "native-base";

let showToastsInArr = function (arr, params = {}) {
  Toast.show({
      text: arr,
      buttonText: params.buttonText || "OK",
      type: params.type || "danger",
      position: params.position || "top",
      duration: params.duration || 5000
    });
}

export async function handleError(component, result) {
  if (result.ApiErr) {
    component.setState({ ApiErrors: result.ApiErr[0].slice(9) });
    showToastsInArr(result.ApiErr[0].slice(9));
  }
}
