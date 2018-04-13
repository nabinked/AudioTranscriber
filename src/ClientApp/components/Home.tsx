import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import axios, { AxiosResponse } from 'axios';
import { JobList } from './JobList';

interface HomeState {
    file: File;
    jobs?: Array<any>;
    uploading?: boolean;
}
export class Home extends React.Component<RouteComponentProps<any>, HomeState> {
    pollInterval: number;

    constructor(props: RouteComponentProps<any>) {
        super(props);
        this.pollInterval = 0;
        this.state = {
            file: null,
            jobs: []
        }
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.fileUpload = this.fileUpload.bind(this);
    }
    componentDidMount() {
        this.getJobs();
        this.startPoll();
    }

    componentWillUnmount() {
        clearInterval(this.pollInterval);
    }

    startPoll() {
        this.pollInterval = setInterval(() => { this.getJobs() }, 10000);
    }
    getJobs() {
        axios.get('/job').then((res: any) => {
            this.setState({
                jobs: res.data.listTranscriptionJobsResponse.transcriptionJobSummaries
            });
        });
    }
    onFormSubmit(this: Home, e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault(); // Stop form submit
        if (this.state.file) {
            this.fileUpload(this.state.file).then(() => {
                this.getJobs();
                this.setState({
                    uploading: false
                });
            }).catch(() => {
                this.setState({
                    uploading: false
                });
            });
        } else {
            alert('Please select afile first.');
        }
    }
    onChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target && e.target.files) {
            this.setState({ file: e.target.files[0] });
        }
    }
    fileUpload(file: File) {
        this.setState({
            uploading: true
        });
        const url = '/job';
        const formData = new FormData();
        formData.append('file', file);
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        return axios.post(url, formData, config);
    }

    render() {
        const uploading = this.state.uploading ? 'Uploading...' : 'Upload';
        return (
            <div>
                <h1>Upgrowth Audio Transcriber</h1>
                <form onSubmit={this.onFormSubmit.bind(this)}>
                    <input type="file" onChange={this.onChange} />
                    <br />
                    <br />
                    <button type="submit">{uploading}</button>
                </form>
                <br />
                <JobList jobs={this.state.jobs} />
            </div>
        );
    }

}

