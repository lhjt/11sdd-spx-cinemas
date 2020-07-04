import { Typography } from "@material-ui/core";
import * as React from "react";
import { RouteComponentProps } from "react-router-dom";

export interface SessionPageProps extends RouteComponentProps<{ sessionId: string }> {}

export interface SessionPageState {}

class SessionPage extends React.Component<SessionPageProps, SessionPageState> {
    constructor(props: SessionPageProps) {
        super(props);
        this.state = {};
    }

    render() {
        const { sessionId } = this.props.match.params;
        return <Typography>{sessionId}</Typography>;
    }
}

export default SessionPage;
