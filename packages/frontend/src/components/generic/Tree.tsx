import React from "react";
import {useQuery} from "react-apollo";
import {gql} from "apollo-boost";
import {AccountTree, ChevronRight, ExpandMore, MoreHoriz} from "@material-ui/icons";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Tooltip} from "@material-ui/core";
import {TreeItem, TreeView} from "@material-ui/lab";

interface ITreeProps {
    tree: string;
    title: string;
}

const buildQuery = (tree: string) => gql`
    query {
        ${tree} {
        id
        name
        parent {
            id
        }
        children {
            id
        }
    }
    }
`;

interface INode {
    id: string;
    name: string;
    parent: string | null;
    children: [{ id: string }];
}

const Tree: React.FC<ITreeProps> = ({tree, title}) => {
    const {data, loading, error} = useQuery(buildQuery(tree), {fetchPolicy: "no-cache"});
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    if (loading || error || !data) {
        return (
            <IconButton onClick={handleOpen} disabled>
                <AccountTree/>
            </IconButton>
        );
    }

    const nodes: INode[] = (data[tree] || []);
    const roots: INode[] = nodes.filter(n => n.parent == null);

    const buildRoot = ({name, children, id}: INode) => {
        return (
            <TreeItem label={name} nodeId={id} key={id}>
                {
                    children.length > 0 ?
                        children
                            .map(child => nodes.find(n => n.id == child.id))
                            .map(node => node && buildRoot(node))
                        : null
                }
            </TreeItem>
        );
    };

    return (
        <React.Fragment>
            <Tooltip title={`Tree view`} placement="top">
                <IconButton onClick={handleOpen}>
                    <AccountTree/>
                </IconButton>
            </Tooltip>
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>{`Tree view for ${title}`}</DialogTitle>
                <DialogContent dividers={true}>
                    <TreeView
                        defaultEndIcon={<MoreHoriz style={{opacity: 0.2}}/>}
                        defaultCollapseIcon={<ExpandMore/>}
                        defaultExpandIcon={<ChevronRight/>}
                    >
                        {
                            roots.map(root => buildRoot(root))
                        }
                    </TreeView>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">Close</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};
export default Tree;
