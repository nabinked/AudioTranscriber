import * as React from 'react';
import { JobRow } from './JobRow';
import { TranscriptionJob } from './JobDetail';

interface JobListProps {
    jobs?: Array<TranscriptionJob>;
}

export class JobList extends React.Component<JobListProps, {}> {
    render() {
        return (
            this.props.jobs ?
                <table>
                    <caption><h2>Transcriptions (updates every 10 seconds)</h2></caption>
                    <thead></thead>
                    <tbody>
                        {this.props.jobs &&
                            this.props.jobs.map((job) => {
                                return <JobRow key={job.transcriptionJobName} job={job} />;
                            })}
                    </tbody>
                </table>
                :
                <span>No Jobs Found</span>
        );
    }
}