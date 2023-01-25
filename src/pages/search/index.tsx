import React from 'react';
import { Container } from 'reactstrap';

interface ISearchProps {
    children: any;
}
interface ISearchState { }

class Search extends React.Component<ISearchProps, ISearchState> {
    constructor(props: ISearchProps) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <Container></Container>
        );
    }
};

export default Search;