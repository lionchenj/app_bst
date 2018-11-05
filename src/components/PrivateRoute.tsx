import * as React from "react"
import { Redirect, Route, RouteComponentProps, RouteProps } from "react-router-dom";
import { UserService } from "../service/UserService";

// via https://stackoverflow.com/questions/42309708/create-own-react-route-class-in-typescript

type RouteComponent = React.StatelessComponent<RouteComponentProps<{}>> | React.ComponentClass<any>


export const PrivateRoute: React.StatelessComponent<RouteProps> = ({component, ...rest}) => {
    const renderFn = (Component?: RouteComponent) => (props: RouteProps) => {
        if (!Component) {
            return null
        }
        if (UserService.Instance.isLogined()) {
            return <Component {...props} />
        }
        const redirectProps = {
            to: {
                pathname: "/login",
                state: {from: props.location}
            }
        }
        return <Redirect {...redirectProps} />
    }

    return <Route {...rest} render={renderFn(component)} />
}
