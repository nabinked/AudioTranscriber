import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import axios from 'axios';


export interface TranscriptionJob {
    completionTime: string;
    creationTime: string;
    failureReason: any;
    languageCode: { value: string };
    media: { mediaFileUri: string }
    transcriptionJobName: string;
    transcriptionJobStatus: { value: string }
    transcript: { transcriptFileUri: string }
}

export class JobDetail extends React.Component<RouteComponentProps<{ jobName: string }>, { job?: TranscriptionJob, transcript: string }> {
    constructor(props: RouteComponentProps<{ jobName: string }>) {
        super(props);
        this.state = {
            job: null,
            transcript: null
        }
    }
    async componentDidMount() {
        const res1 = await axios.get(`/job/${this.props.match.params.jobName}`);
        this.setState({
            job: res1.data
        });
        const res2 = await axios.get(res1.data.transcript.transcriptFileUri);
        this.setState({
            ...this.state,
            transcript: res2.data.results.transcripts[0].transcript
        });
    }

    render() {
        return (
            <div>
                <h1>{this.props.match.params.jobName}</h1>
                {
                    this.state.transcript ?
                        <p>
                            {this.state.transcript}
                        </p>
                        : <span>Fetching job detail...</span>
                }
            </div>
        );
    }
}