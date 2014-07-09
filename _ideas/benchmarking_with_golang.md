Go is a nice fit for comparative benchmarks.

Could write something for benchmarking concurrent apps to e.g. ensure that elasticsearch can handle our search load.

Given
 * a query generator (creating an identical stream of queries)
 * some query processor implementations

For each concurrency level C and each processor implementation, find
 * error rate
 * throughput (lowest, highest, average)
 * latency (lowest, highest, median, 90%, 99%)
