import { css } from "@fluentui/react";
import {
    Card,
    CardContent,
    CardHeader,
    createStyles,
    makeStyles,
    Theme,
    Typography,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import * as React from "react";

export interface SkeletonSessionsOverviewCardProps {}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: "100%",
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
        },
        sessionPill: {
            width: 200,
            marginBottom: theme.spacing(2),
        },
        titleSkeleton: {
            borderRadius: 5,
        },
    })
);

const SkeletonSessionsOverviewCard: React.SFC<SkeletonSessionsOverviewCardProps> = () => {
    const classes = useStyles();

    return (
        <Card className={css(classes.root)}>
            <CardHeader
                title={
                    <Skeleton
                        className={classes.titleSkeleton}
                        variant="rect"
                        height={32}
                        width={200}
                    />
                }
            />
            <CardContent>
                <Card className={css(classes.sessionPill)} variant="outlined">
                    <CardContent>
                        <Typography>
                            <Skeleton />
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary">
                            <Skeleton />
                        </Typography>
                    </CardContent>
                </Card>
                <Card className={css(classes.sessionPill)} variant="outlined">
                    <CardContent>
                        <Typography>
                            <Skeleton />
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary">
                            <Skeleton />
                        </Typography>
                    </CardContent>
                </Card>
                <Card className={css(classes.sessionPill)} variant="outlined">
                    <CardContent>
                        <Typography>
                            <Skeleton />
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary">
                            <Skeleton />
                        </Typography>
                    </CardContent>
                </Card>
                <Card className={css(classes.sessionPill)} variant="outlined">
                    <CardContent>
                        <Typography>
                            <Skeleton />
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary">
                            <Skeleton />
                        </Typography>
                    </CardContent>
                </Card>
                <Card className={css(classes.sessionPill)} variant="outlined">
                    <CardContent>
                        <Typography>
                            <Skeleton />
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary">
                            <Skeleton />
                        </Typography>
                    </CardContent>
                </Card>
            </CardContent>
        </Card>
    );
};

export default SkeletonSessionsOverviewCard;
