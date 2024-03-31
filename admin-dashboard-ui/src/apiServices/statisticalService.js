import { authRequest, reservationRequest } from '@/utils/request';
import { chartsConfig } from '@/configs';
import { BanknotesIcon, UserPlusIcon, UsersIcon, ChartBarIcon } from '@heroicons/react/24/solid';

export const getUserStatistical = async (year = 2024, token) => {
    try {
        const res = await authRequest.get('/user/statistical', {
            params: { year },
            headers: { Authorization: 'Bearer ' + token },
            transformResponse: [
                function (data) {
                    let userViewsChart = {
                        type: 'bar',
                        height: 220,
                        series: [
                            {
                                name: 'Total user',
                                data: [50, 20, 10, 22, 50, 10, 40],
                            },
                        ],
                        options: {
                            ...chartsConfig,
                            colors: '#388e3c',
                            plotOptions: {
                                bar: {
                                    columnWidth: '16%',
                                    borderRadius: 5,
                                },
                            },
                            xaxis: {
                                ...chartsConfig.xaxis,
                                categories: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
                            },
                        },
                    };
                    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    const sData = JSON.parse(data);
                    const dataSeries = sData.map((data) => +data.totalUser);
                    const xaxisCategories = sData.map((data) => months[data.month - 1]);
                    userViewsChart.series[0].data = dataSeries;
                    userViewsChart.options.xaxis.categories = xaxisCategories;
                    const objResult = {
                        color: 'white',
                        title: 'User view',
                        description: 'User statistical each month',
                        footer: 'just updated',
                        chart: userViewsChart,
                    };
                    return objResult;
                },
            ],
        });
        return res;
    } catch (error) {
        console.log('Get user statistical request error!');
        console.log(error);
    }
};

export const getReservationStatistical = async (year = 2024, token) => {
    try {
        const res = await reservationRequest.get('/order/statistical', {
            params: { year },
            headers: { Authorization: 'Bearer ' + token },
            transformResponse: [
                function (data) {
                    let monthlySalesChart = {
                        type: 'line',
                        height: 220,
                        series: [
                            {
                                name: 'Sales',
                                data: [50, 40, 300, 320, 500, 350, 200, 230, 500],
                            },
                            {
                                name: 'Service fee',
                                data: [50, 40, 300, 320, 500, 350, 200, 230, 500],
                            },
                        ],
                        options: {
                            ...chartsConfig,
                            colors: ['#0288d1', '#007F73'],
                            stroke: {
                                lineCap: 'round',
                            },
                            markers: {
                                size: 5,
                            },
                            xaxis: {
                                ...chartsConfig.xaxis,
                                categories: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                            },
                        },
                    };
                    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    const sData = JSON.parse(data);
                    const dataSeries1 = sData.map((data) => +data.totalSum);
                    const dataSeries2 = sData.map((data) => +data.serviceFeeSum);
                    const xaxisCategories = sData.map((data) => months[data.month - 1]);
                    monthlySalesChart.series[0].data = dataSeries1;
                    monthlySalesChart.series[1].data = dataSeries2;
                    monthlySalesChart.options.xaxis.categories = xaxisCategories;

                    let monthlyOrderChart = {
                        type: 'line',
                        height: 220,
                        series: [
                            {
                                name: 'Orders',
                                data: [50, 40, 300, 320, 500, 350, 200, 230, 500],
                            },
                        ],
                        options: {
                            ...chartsConfig,
                            colors: ['#5356FF'],
                            stroke: {
                                lineCap: 'round',
                            },
                            markers: {
                                size: 5,
                            },
                            xaxis: {
                                ...chartsConfig.xaxis,
                                categories: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                            },
                        },
                    };
                    const dataSeries3 = sData.map((data) => +data.totalOrders);
                    monthlyOrderChart.series[0].data = dataSeries3;
                    monthlyOrderChart.options.xaxis.categories = xaxisCategories;
                    const result1 = {
                        color: 'white',
                        title: 'Monthly Sales',
                        description: '15% increase in last month sales',
                        footer: 'updated 1 min ago',
                        chart: monthlySalesChart,
                    };
                    const result2 = {
                        color: 'white',
                        title: 'Monthly Orders',
                        description: '10% increase in last moth orders',
                        footer: 'updated 3 min ago',
                        chart: monthlyOrderChart,
                    };
                    return [result1, result2];
                },
            ],
        });
        return res;
    } catch (error) {
        console.log('Get order statistical request error!');
        console.log(error);
    }
};

export const getStatisticalDataCard = async (year = 2024, token, role = 'MOVIE_BUSINESS') => {
    try {
        let statisticsCardsData = [
            {
                color: 'gray',
                icon: BanknotesIcon,
                title: 'Orders',
                value: '$53k',
                footer: {
                    color: 'text-green-500',
                    value: '+10%',
                    label: 'than last year',
                },
            },
            {
                color: 'gray',
                icon: UsersIcon,
                title: 'Total Users',
                value: '2,300',
                footer: {
                    color: 'text-green-500',
                    value: '+3%',
                    label: 'than last month',
                },
            },
            {
                color: 'gray',
                icon: UserPlusIcon,
                title: 'New Clients',
                value: '3,462',
                footer: {
                    color: 'text-red-500',
                    value: '-2%',
                    label: 'than yesterday',
                },
            },
            {
                color: 'gray',
                icon: ChartBarIcon,
                title: 'Sales',
                value: '103,430',
                footer: {
                    color: 'text-green-500',
                    value: '+5%',
                    label: 'than yesterday',
                },
            },
        ];
        const res1 = await authRequest.get('/user/statistical', {
            params: { year },
            headers: { Authorization: 'Bearer ' + token },
            transformResponse: [
                function (data) {
                    const sData = JSON.parse(data);
                    const totalUsers = sData.reduce(
                        (accumulator, currentValue) => accumulator + currentValue.totalUser,
                        0,
                    );
                    const today = new Date();
                    const newClients = sData.filter((it) => +it.month === today.getMonth() + 1)[0].totalUser;
                    return { totalUsers, newClients };
                },
            ],
        });
        statisticsCardsData[1].value = res1.totalUsers;
        statisticsCardsData[2].value = res1.newClients;
        const res2 = await reservationRequest.get('/order/statistical', {
            params: { year },
            headers: { Authorization: 'Bearer ' + token },
            transformResponse: [
                function (data) {
                    const sData = JSON.parse(data);
                    let sales = 0;
                    if (role === 'MOVIE_BUSINESS') {
                        sales = sData.reduce(
                            (accumulator, currentValue) =>
                                accumulator + currentValue.totalSum - currentValue.serviceFeeSum,
                            0,
                        );
                    } else {
                        sales = sData.reduce(
                            (accumulator, currentValue) => accumulator + currentValue.serviceFeeSum,
                            0,
                        );
                    }
                    const orders = sData.reduce(
                        (accumulator, currentValue) => accumulator + currentValue.totalOrders,
                        0,
                    );
                    return { sales, orders };
                },
            ],
        });
        statisticsCardsData[0].value = res2.orders;
        statisticsCardsData[3].value = res2.sales;
        return statisticsCardsData;
    } catch (error) {
        console.log('Get statistical for cards request error!');
        console.log(error);
    }
};
