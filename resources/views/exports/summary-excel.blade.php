<table>
    <thead>
        <tr>
            <th colspan="2"><strong>Overall Metrics</strong></th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Total in Batch</td>
            <td>{{ $summary['overall']['total_in_batch'] }}</td>
        </tr>
        <tr>
            <td>Registered</td>
            <td>{{ $summary['overall']['registered'] }}</td>
        </tr>
        <tr>
            <td>Pending</td>
            <td>{{ $summary['overall']['pending'] }}</td>
        </tr>
        <tr>
            <td>Stage 1 Complete</td>
            <td>{{ $summary['overall']['stage_1'] }}</td>
        </tr>
        <tr>
            <td>Stage 2 Complete</td>
            <td>{{ $summary['overall']['stage_2'] }}</td>
        </tr>
        <tr>
            <td>Stage 3 Complete</td>
            <td>{{ $summary['overall']['stage_3'] }}</td>
        </tr>
        <tr>
            <td>Fully Complete</td>
            <td>{{ $summary['overall']['complete'] }}</td>
        </tr>
        <tr>
            <td>Faulty on Arrival</td>
            <td>{{ $summary['overall']['faulty_on_arrival'] }}</td>
        </tr>
        <tr>
            <td>Percent Complete</td>
            <td>{{ $summary['overall']['percent_complete'] }}%</td>
        </tr>
    </tbody>
</table>

<table>
    <thead>
        <tr>
            <th colspan="5"><strong>Department Breakdown</strong></th>
        </tr>
        <tr>
            <th><strong>Department</strong></th>
            <th><strong>Assigned</strong></th>
            <th><strong>In Progress</strong></th>
            <th><strong>Completed</strong></th>
            <th><strong>Percent Complete</strong></th>
        </tr>
    </thead>
    <tbody>
        @foreach($summary['by_department'] as $dept)
            <tr>
                <td>{{ $dept['name'] }} ({{ $dept['code'] }})</td>
                <td>{{ $dept['assigned'] }}</td>
                <td>{{ $dept['in_progress'] }}</td>
                <td>{{ $dept['completed'] }}</td>
                <td>{{ $dept['percent_complete'] }}%</td>
            </tr>
        @endforeach
    </tbody>
</table>

@if(!empty($summary['batch_comparison']))
    <table>
        <thead>
            <tr>
                <th colspan="5"><strong>Batch Comparison</strong></th>
            </tr>
            <tr>
                <th><strong>Batch</strong></th>
                <th><strong>Total PCs</strong></th>
                <th><strong>Registered</strong></th>
                <th><strong>Complete</strong></th>
                <th><strong>Percent Complete</strong></th>
            </tr>
        </thead>
        <tbody>
            @foreach($summary['batch_comparison'] as $batch)
                <tr>
                    <td>{{ $batch['label'] }}</td>
                    <td>{{ $batch['total_pcs'] }}</td>
                    <td>{{ $batch['registered'] }}</td>
                    <td>{{ $batch['complete'] }}</td>
                    <td>{{ $batch['percent_complete'] }}%</td>
                </tr>
            @endforeach
        </tbody>
    </table>
@endif
