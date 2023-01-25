import React from 'react';
import {
    Form,
    Container,
    Row, Col,
    Input,
    InputGroup,
    Button,
    ListGroup, ListGroupItem
} from 'reactstrap';
import { set } from 'lodash';
import { medication } from './data';

interface IAutoCompleteProps {
    children?: any;
}
interface IAutoCompleteState {
    searchInput: string;
    searchEntries: Promise<any>;
    matchSearchEntries: Array<any>;
    isSearching: boolean;
    selectedMedication?: any;
    lastSelectedEntry: Array<any>;
}

class AutoComplete extends React.Component<IAutoCompleteProps, IAutoCompleteState> {
    constructor(props: IAutoCompleteProps) {
        super(props);
        this.state = {
            searchInput: "",
            searchEntries: AutoComplete.getSearchEntries() || [],
            matchSearchEntries: [],
            isSearching: true,
            selectedMedication: undefined,
            lastSelectedEntry: []
        }
    }

    static getSearchEntries = () => {
        const randomizeTimeout = Math.random() * 1000;
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(medication);
            }, randomizeTimeout);
        });
    }

    public onChange = (event: any) => {
        const newState = this.state;
        const target = event && event.currentTarget ? event.currentTarget : event.target;
        set(newState, target.name, target.value);
        this.setState(newState);

        // Filter data by form input
        this._updateSearchEntries(target.value);
    }

    public _updateSearchEntries = async (value: string, selectedFilter?: string) => {
        const valueCheck = value.toLowerCase();
        let updateMatchList: any = [];
        let updateMatchTermList: any = {};
        const getAllSearchEntries: Array<any> = await this.state.searchEntries;
        if (getAllSearchEntries && getAllSearchEntries.length > 0) {
            getAllSearchEntries.map((entry: any) => {
                let matchFound: boolean = false;
                let prepData: any = false;
                prepData = this._prepAndReturnWantedData(entry, valueCheck, updateMatchTermList);
                matchFound = prepData.found;
                updateMatchTermList = prepData.matchList
                if (matchFound === true) {
                    updateMatchList = updateMatchList.length > 0 ? [...updateMatchList, entry] : [entry];
                }
                return entry;
            });
        }

        this.setState({
            matchSearchEntries: updateMatchList
        });
    }

    public _prepAndReturnWantedData = (data: any, selectedTerm: string, matchTermList: any) => {
        let isViable = false;
        if (typeof (data.name) === "string" && data.name.toLowerCase().indexOf(selectedTerm) !== -1) {
            isViable = true;
            if (data.name.toLowerCase().length !== selectedTerm.length) {
                matchTermList[data.name.toLowerCase()] = "true";
            }
        }
        return { found: isViable, matchList: matchTermList };
    }

    public highlightText = (text: string) => {
        let updateText: any = typeof (text) === "string" ? text.toLowerCase() : `${text}`;
        let searchText: any = typeof (this.state.searchInput) === "string" ? this.state.searchInput.toLowerCase() : this.state.searchInput;
        if (updateText && searchText && updateText.indexOf(searchText) !== -1) {
            const getIndex = updateText.indexOf(searchText);
            const stitchHtml = updateText.split(searchText);

            if (getIndex === 0) {
                updateText = (<React.Fragment><mark>{searchText}</mark>{stitchHtml[1]}</React.Fragment>);
            } else if (stitchHtml[1] === "") {
                updateText = (<React.Fragment>{stitchHtml[0]}<mark>{searchText}</mark></React.Fragment>);
            } else {
                updateText = (<React.Fragment>{stitchHtml[0]}<mark>{searchText}</mark>{stitchHtml[1]}</React.Fragment>);
            }
        };

        return updateText;
    }

    public clearSearchField = () => {
        this.onChange({
            currentTarget: {
                name: "searchInput",
                value: ""
            }
        });
    }

    public selectSearchResult = (entry: any, previousEntry?: boolean) => {
        if (this.state.lastSelectedEntry.length > 0)

            this.onChange({
                currentTarget: {
                    name: "searchInput",
                    value: previousEntry ? entry.name : ""
                }
            });

        this.setState({
            selectedMedication: entry,
            matchSearchEntries: [],
            lastSelectedEntry: previousEntry ?
                this.state.lastSelectedEntry :
                this.state.lastSelectedEntry.length > 0 ?
                    [entry, ...this.state.lastSelectedEntry] :
                    [entry]
        });
    }

    render() {
        let {
            searchInput,
            matchSearchEntries,
            selectedMedication,
            lastSelectedEntry
        } = this.state;

        return (
            <Form
                autocomplete="off"
                style={{
                    textAlign: "center"
                }}>
                <Container>
                    <h1>Autocomplete Widget</h1>

                    <Row>
                        <Col md="12">

                            {/* Search Form */}
                            <Row form className='form-row'>
                                <Col className="mt-3 pl-0">
                                    <InputGroup style={{ width: "500px", margin: "0 auto" }}>
                                        <Input
                                            type="text"
                                            name="searchInput"
                                            value={searchInput}
                                            onChange={(event: any) => this.onChange(event)}
                                            placeholder="Search"
                                        />
                                        <Button onClick={this.clearSearchField}>x</Button>
                                    </InputGroup>

                                    {/* Returned Search Results */}
                                    {(searchInput.length > 0) && (matchSearchEntries.length > 0) ? (
                                        <ListGroup style={{
                                            overflow: "auto",
                                            height: "300px",
                                            width: "500px",
                                            position: "absolute",
                                            left: "0",
                                            right: "0",
                                            borderRadius: "0px",
                                            margin: "0.5em auto"
                                        }}>
                                            {matchSearchEntries.map((entry: any) => {
                                                return (
                                                    <ListGroupItem
                                                        className='m-o p-0'
                                                        onClick={() => this.selectSearchResult(entry)}
                                                    >
                                                        <Button block style={{ borderRadius: 0 }}>
                                                            <small>{this.highlightText(entry.name)}</small>
                                                        </Button>
                                                    </ListGroupItem>
                                                )
                                            })}

                                        </ListGroup>
                                    ) :
                                        (!selectedMedication && searchInput.length !== 0) && (<p className='m-0 p-2'><small>No search results found. Try another search term</small></p>)
                                    }
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                    {/* Last Selected Entry */}
                    {(lastSelectedEntry.length > 0) && (
                        <Row>
                            <Col className="mt-2 mb-4 mt--1">
                                <>
                                    <small>Last Selected Item</small><br />
                                    {lastSelectedEntry.map((entry: any) => {
                                        return (
                                            <Button
                                                color="primary"
                                                className="m-1"
                                                onClick={() => this.selectSearchResult(entry, true)}
                                            >{entry.name}</Button>
                                        )
                                    })}
                                </>
                            </Col>
                        </Row>
                    )}

                    {selectedMedication && (
                        <Row>
                            <Col>
                                <Button className='m-5' onClick={(event) => event.preventDefault()}>
                                    <small>{selectedMedication.pzn}</small><br />
                                    <big>{selectedMedication.name}</big><br />

                                    <span>Strength: {selectedMedication.strengthValue} {selectedMedication.strengthUnit}</span><br />
                                    <span>Amount: {selectedMedication.amountValue} {selectedMedication.amountUnit}</span>
                                </Button>
                            </Col>
                        </Row>
                    )}
                </Container>
            </Form>
        );
    }
};

export default AutoComplete;