<!DOCTYPE html>
<html>
<head>
    <title>User Insights Report</title>
    <style>
        body { font-family: sans-serif; font-size: 14px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { padding: 8px; border: 1px solid #ddd; text-align: left; }
        th { background-color: #f4f4f5; }
        h1 { font-size: 20px; }
        h2 { font-size: 16px; margin-top: 20px; color: #333; }
    </style>
</head>
<body>
    <h1>User Insights Report</h1>
    <p>Generated on: {{ now()->format('Y-m-d H:i') }}</p>

    <h2>Top Performers</h2>
    <table>
        <thead>
            <tr>
                <th>User</th>
                <th>Tasks Completed</th>
            </tr>
        </thead>
        <tbody>
            @foreach($data['topPerformers'] as $performer)
            <tr>
                <td>{{ $performer['user'] }}</td>
                <td>{{ $performer['tasks_count'] }}</td>
            </tr>
            @endforeach
            @if(count($data['topPerformers']) === 0)
            <tr><td colspan="2">No data available.</td></tr>
            @endif
        </tbody>
    </table>

    <h2>Workload Bottlenecks</h2>
    <table>
        <thead>
            <tr>
                <th>User</th>
                <th>Average Time (Hours)</th>
                <th>Tasks Count</th>
            </tr>
        </thead>
        <tbody>
            @foreach($data['bottlenecks'] as $bottleneck)
            <tr>
                <td>{{ $bottleneck['user'] }}</td>
                <td>{{ $bottleneck['avg_duration'] }}</td>
                <td>{{ $bottleneck['tasks_count'] }}</td>
            </tr>
            @endforeach
            @if(count($data['bottlenecks']) === 0)
            <tr><td colspan="3">No data available.</td></tr>
            @endif
        </tbody>
    </table>
</body>
</html>
