import * as React from 'react';
import { Link } from 'react-router-dom';
import { TranscriptionJob } from './JobDetail';

interface JobRowProps {
    job?: TranscriptionJob;
}
export class JobRow extends React.Component<JobRowProps, {}> {
    render() {
        const completionDate = new Date(this.props.job.completionTime);
        const creationDate = new Date(this.props.job.creationTime);
        return (
            <tr>
                <td>
                    <Link to={`/jobdetail/${this.props.job.transcriptionJobName}`}>{
                        this.props.job.transcriptionJobName}</Link>
                </td>
                <td>{`${completionDate.toLocaleDateString()} ${completionDate.toLocaleTimeString()}`}</td>
                <td>{`${creationDate.toLocaleDateString()} ${creationDate.toLocaleTimeString()}`}</td>
                
                <td>{this.props.job.languageCode.value}</td>
                <td>{this.props.job.transcriptionJobStatus.value}</td>
                <td>{this.props.job.failureReason}</td>
            </tr>
        );
    }
}