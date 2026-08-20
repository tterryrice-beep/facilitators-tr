import { FireBaseRunner } from "@/modules/FireBase/FB";

const privateVars: {
  _fbRunner?: FireBaseRunner;
} = {}

export const instances: { fb: () => FireBaseRunner } = {
  fb: () => {
    if (!privateVars._fbRunner) {
      privateVars._fbRunner = new FireBaseRunner();
    }

    return privateVars._fbRunner;
  }
};
