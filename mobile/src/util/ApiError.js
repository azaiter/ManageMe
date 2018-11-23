import { Toast } from "native-base";

let showToastsInArr = function (arr, params = {}) {
    arr.forEach(message => {
        Toast.show({
            text: message,
            buttonText: params.buttonText || "okay",
            type: params.type || "warning",
            position: params.position || "top",
            duration: params.duration || 5000
        });
    });
};

export async function handleError (component, result) {
    component.setState({ ApiErrorsList: result });
    showToastsInArr(result);
};