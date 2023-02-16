import {
  MaterialDateTimeControl,
  materialDateTimeControlTester,
  MaterialNumberControl,
  materialNumberControlTester,
  MaterialTextControl,
  materialTextControlTester,
  MaterialEnumControl,
  materialEnumControlTester,
  MaterialBooleanControl,
  materialBooleanControlTester,
  PdfUploadWidgetControl,
  pdfUploadWidgetControlTester,
  AbnWidgetControl,
  abnWidgetControlTester,
} from './InputRenders/controls';
import {
  MaterialHorizontalLayoutRenderer,
  materialHorizontalLayoutTester,
} from './Layouts';
import MaterializedGroupLayoutRenderer, {
  materialGroupTester,
} from './Layouts/GroupLayout';

export const Renderers = [
  { tester: materialGroupTester, renderer: MaterializedGroupLayoutRenderer },
  { tester: materialTextControlTester, renderer: MaterialTextControl },
  { tester: materialDateTimeControlTester, renderer: MaterialDateTimeControl },
  { tester: materialNumberControlTester, renderer: MaterialNumberControl },
  { tester: materialEnumControlTester, renderer: MaterialEnumControl },
  { tester: materialBooleanControlTester, renderer: MaterialBooleanControl },

  {
    tester: materialHorizontalLayoutTester,
    renderer: MaterialHorizontalLayoutRenderer,
  },
  { tester: pdfUploadWidgetControlTester, renderer: PdfUploadWidgetControl },
  { tester: abnWidgetControlTester, renderer: AbnWidgetControl },
];
