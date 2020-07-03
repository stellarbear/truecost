import {CImageList} from "./CImageList";
import {CBoolean} from "./CBoolean";
import {CString} from "./CString";
import {CSelect} from "./CSelect";
import {CNumber} from "./CNumber";
import {CImage} from "./CImage";
import {CLink} from "./CLink";
import {CGeo} from "./CGeo";
import {CDate} from "./CDate";
import {CStringMask} from "./CStringMask";
import {CStringPassword} from "./CStringPassword";
import {CStringCustom} from "./CStringCustom";

type ItemProp =
    CString
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
    | CStringCustom;

export {
    ItemProp,
    CImage,
    CSelect,
    CBoolean,
    CString,
    CLink,
    CImageList,
    CDate,
    CStringMask,
    CStringPassword,
    CStringCustom,
};
