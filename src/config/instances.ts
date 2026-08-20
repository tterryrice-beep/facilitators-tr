import { FireBaseRunner } from "@/modules/FireBase";

const privateVars: {
  _fbRunner?: FireBaseRunner;
} = {}

export const instances: Partial<{ fb: () => FireBaseRunner }> = {
  fb: () => {
    if (!privateVars._fbRunner) {
      privateVars._fbRunner = new FireBaseRunner();
    }

    return privateVars._fbRunner;
  }
};
