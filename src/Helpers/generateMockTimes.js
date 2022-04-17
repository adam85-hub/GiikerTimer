export default function generateMockTimes(n) {
    const mockTimes = [];

    for (let i = 1; i <= n; i++) {
        mockTimes.push({
            time: i,
            tps: i/2
        });
    }

    return mockTimes;
}
