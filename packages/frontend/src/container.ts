import {Context, createContext, useContext} from "react";


const AppContext = createContext<any>(null);

export class AppContainer {
    public static get context() {
        return AppContext as Context<AppContainer>;
    }

    public static use() {
        return useContext<AppContainer>(this.context);
    }
}
