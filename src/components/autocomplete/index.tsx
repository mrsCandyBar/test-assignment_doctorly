import React from 'react';
import {
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
    lastSearchedTerms: Array<string>;
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
            lastSearchedTerms: []
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

    public _updateSearchEntries = (value: string, selectedFilter?: string) => {
        const valueCheck = value.toLowerCase();
        let updateMatchList: any = [];
        let updateMatchTermList: any = {};
        //if (this.state.searchEntries && this.state.searchEntries.length > 0) {
        if (medication.length > 0) {
            //let allEntries:any = [ ...this.state.searchEntries];
            let allEntries: any = [...medication];
            allEntries.map((entry: any) => {
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

    public selectSearchResult = (entry: any) => {
        this.onChange({
            currentTarget: {
                name: "searchInput",
                value: entry.name
            }
        });

        this.setState({
            selectedMedication: entry,
            matchSearchEntries: [],
            lastSearchedTerms: this.state.lastSearchedTerms.length > 0 ?
                [this.state.searchInput, ...this.state.lastSearchedTerms] :
                [this.state.searchInput]
        });
    }

    render() {
        let {
            searchInput,
            matchSearchEntries,
            selectedMedication,
            lastSearchedTerms
        } = this.state;

        return (
            <React.Fragment>
                <h1>Autocomplete Widget</h1>

                <Row>
                    <Col md="12">
                        <div className={`siteSearch`}>

                            {/* Search Form */}
                            <Row form className='form-row'>
                                <Col className="mt-3 pl-0">
                                    <InputGroup>
                                        <Input
                                            type="text"
                                            name="searchInput"
                                            value={searchInput}
                                            onChange={(event: any) => this.onChange(event)}
                                            placeholder="Search"
                                        />
                                        <Button onClick={this.clearSearchField}>x</Button>
                                    </InputGroup>
                                </Col>
                            </Row>


                            {(searchInput.length > 0) && (
                                <>

                                    {/* Returned Search Results */}
                                    {(matchSearchEntries.length > 0) ? (
                                        <Row className='m-0 p-0'>
                                            <Col className='m-0 p-0'>
                                                <ListGroup>
                                                    {matchSearchEntries.map((entry: any) => {
                                                        return (
                                                            <ListGroupItem onClick={() => this.selectSearchResult(entry)}>
                                                                <small>{this.highlightText(entry.name)}</small>
                                                            </ListGroupItem>
                                                        )
                                                    })}

                                                </ListGroup>
                                            </Col>
                                        </Row>
                                    ) :
                                        !selectedMedication && (<p className='m-0 p-2'><small>No search results found. Try another search term</small></p>)
                                    }
                                </>
                            )}
                        </div>
                    </Col>
                </Row>

                {/* Last Searched terms */}
                {(lastSearchedTerms.length > 0) && (
                    <Row>
                        <Col className="mt-2 mb-4 mt--1">
                            <>
                                <small>Last Searched Term :</small>
                                {lastSearchedTerms.map((searchTerm: string) => {
                                    return (
                                        <Button
                                            color="primary"
                                            className="m-1"
                                            onClick={() => this.onChange({ currentTarget: { name: "searchInput", value: searchTerm } })}
                                        >{searchTerm}</Button>
                                    )
                                })}
                            </>
                        </Col>
                    </Row>
                )}

                {selectedMedication && (
                    <Row>
                        <Col>
                            <Button className='m-5'>
                                <small>{selectedMedication.pzn}</small><br />
                                <big>{selectedMedication.name}</big><br />

                                <span>Strength: {selectedMedication.strengthValue} {selectedMedication.strengthUnit}</span><br />
                                <span>Amount: {selectedMedication.amountValue} {selectedMedication.amountUnit}</span>
                            </Button>
                        </Col>
                    </Row>
                )}

            </React.Fragment >
        );
    }
};

export default AutoComplete;