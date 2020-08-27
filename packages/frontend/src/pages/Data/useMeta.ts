import {useHistory} from "react-router";
import {useState, useEffect} from "react";
import {IGame, IGameContext, Dict, arrayToDict} from "@truecost/shared";
import {SafeJSON} from "auxiliary/json";

interface IProps {
    url: string
    tags: string
    active: boolean
}

export interface IMeta {
    url: string
    tags: Dict<string>
}

const asArray = (src: any) => (Array.isArray(src) ? src : [])

const active = (src: IProps) => src.active

const parseTags = ({url, tags}: IProps): IMeta => ({
    url,
    tags: SafeJSON.parse(tags, {}),
})

export const useMeta = (data: IProps[]) =>
    arrayToDict(asArray(data).filter(active).map(parseTags), "url")
