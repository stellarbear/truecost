import React from "react";
import CRUD from "components/generic/CRUD";
import {CDate, CImageList, CString, CStringCustom} from "components/generic/types";
import {CRUDgql} from "auxiliary";
import EditorPost from "components/EditorPost";
import {meta} from "./Base/Meta";

interface BlogProps {
}

const AdminBlog: React.FC<BlogProps> = (): JSX.Element => {
    const crud = new CRUDgql({
        name: "Blog",
        items: `
			${meta.fragment}

			date
			preview
			text

			images
		`,
    });


    const image = new CImageList({
        key: "images",
        label: "image",
        ext: "jpg",
        limit: 1,
    });

    const date = new CDate({
        key: "date",
        label: "date",
    });

    const text = new CStringCustom({
        key: "text",
        label: "text",
        component: <EditorPost/>,
    });

    const preview = new CString({
        key: "preview",
        label: "preview",
        multiline: true,
    });

    return (
        <CRUD
            pack="input"
            title="Blog"
            queryGet={crud.get}

            mutationDelete={crud.delete}
            mutationUpsert={crud.upsert}
            propsAdd={[...meta.fields, text, date, preview, image]}
            propsList={[...meta.fields, text, date, preview, image]}
            propsFilter={[...meta.fields, text, date, preview]}
        />
    );
};

export default AdminBlog;
