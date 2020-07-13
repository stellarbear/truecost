import * as React from "react";
import PostEditor from "components/EditorPost";

interface ITestProps {
}

const Test: React.FC<ITestProps> = ({}): JSX.Element => {

    return (
        <PostEditor value={"[]"} onChangeEvent={() => {
        }}/>
    );
};

export default Test;
