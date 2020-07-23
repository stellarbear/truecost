import {CBoolean} from "./CBoolean";
import {CString} from "./CString";
import {CNumber} from "./CNumber";
import {CImage} from "./CImage";
import {CCustom} from "./CCustom";
import {CLink} from "./CLink";
import {CDate} from "./CDate";
import {CSelect} from "./CSelect";

type ItemProp = CBoolean
    | CString | CNumber | CImage | CCustom | CLink | CDate | CSelect;
/*  CString
  | CBoolean
  | CSelect
  | CImage
  | CLink
  | CImageList
  | CNumber
  | CGeo
  | CDate
  | CStringMask
  | CStringPassword
  | CStringCustom;*/

export {
    CImage,
    CDate,
    CSelect,
    CLink,
    CCustom,
    ItemProp,
    CBoolean,
    CNumber,
    CString
};
