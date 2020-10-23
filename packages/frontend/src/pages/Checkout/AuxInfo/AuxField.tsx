import * as React from 'react';
import {InputField} from 'components/generic/components/InputField';

interface IProps {
    text: string;
    setText: (value: string) => void;
}

export const AuxField: React.FC<IProps> = ({text, setText}) => (
    <InputField
        placeholder="Playable time is... Main character type is... Etc."
        editable={true}
        multiline={true}
        rowsMax={4}
        label={"Additional information"}
        value={text}
        onChangeEvent={(v) => setText(v.slice(0, 128))} />
);
