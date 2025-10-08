import { GET_ALL_PRODUCTS_BY_ADMIN } from "@/apollo/admin/query";
import withLayoutAdmin from "@/libs/components/layout/AdminLayout";
import { T } from "@/libs/types/common";
import { Product } from "@/libs/types/product/product";
import { ProductsInquiry } from "@/libs/types/product/product.input";
import { useQuery } from "@apollo/client";
import React, { useState } from "react";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
} from "recharts";

const data = [
  {
    name: "18-24",
    uv: 31.47,
    pv: 2400,
    fill: "#8884d8",
  },
  {
    name: "25-29",
    uv: 26.69,
    pv: 4567,
    fill: "#83a6ed",
  },
  {
    name: "30-34",
    uv: 15.69,
    pv: 1398,
    fill: "#8dd1e1",
  },
  {
    name: "35-39",
    uv: 8.22,
    pv: 9800,
    fill: "#82ca9d",
  },
  {
    name: "40-49",
    uv: 8.63,
    pv: 3908,
    fill: "#a4de6c",
  },
  {
    name: "50+",
    uv: 2.63,
    pv: 4800,
    fill: "#d0ed57",
  },
  {
    name: "unknow",
    uv: 6.67,
    pv: 4800,
    fill: "#ffc658",
  },
];

const style = {
  top: "50%",
  right: 0,
  transform: "translate(0, -50%)",
  lineHeight: "24px",
};

const Dashboard = ({ initialInquiry, ...props }: any) => {
  const [productsInquiry, setProductsInquiry] =
    useState<ProductsInquiry>(initialInquiry);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsTotal, setProductsTotal] = useState(0);
  const {
    loading: getAllProductsLoading,
    data: getAllProductsData,
    error: getAllProductsError,
    refetch: getAllProductsRefetch,
  } = useQuery(GET_ALL_PRODUCTS_BY_ADMIN, {
    fetchPolicy: "network-only",
    variables: { input: productsInquiry },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      console.log("GET_ALL_PRODUCTS_BY_ADMIN DATA: ", data);
      setProducts(data?.getAllProductsByAdmin?.list);
      setProductsTotal(data?.getAllMembersByAdmin?.metaCounter[0]?.total ?? 0);
    },
  });

  const chartData = products.map((product, index) => ({
    name: product.productCollection,
    Price: product.productPrice, // or another numeric field
    Discount_Rate: product.productDiscountRate, // or another numeric field
    fill: `hsl(${(index * 60) % 360}, 70%, 50%)`, // dynamic color
  }));

  return (
    <ResponsiveContainer
      width="100%"
      height="90%"
      style={{ marginTop: "80px" }}
    >
      <BarChart
        width={500}
        height={300}
        data={chartData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
        <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
        <Tooltip />
        <Legend />
        <Bar yAxisId="left" dataKey="Price" fill="#8884d8" />
        <Bar yAxisId="right" dataKey="Discount_Rate" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
};

Dashboard.defaultProps = {
  initialInquiry: {
    page: 1,
    limit: 1000,
    search: {},
  },
};

export default withLayoutAdmin(Dashboard);
