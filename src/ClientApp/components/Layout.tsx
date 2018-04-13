import * as React from 'react';

interface LayoutProps {
    children?: React.ReactNode;
}
export class Layout extends React.Component<LayoutProps, {}> {
    render() {
        return <div className="app-wrapper">
            {this.props.children}
        </div>;
    }
}