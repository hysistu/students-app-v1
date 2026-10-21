"use client";
import { api } from "@/lib/api";
import { PageResult, Product } from "@/lib/types";
import React, { useEffect } from "react";
import Pagination from "@/components/pagination";
import ProductCard from "../landingPage/ProductCard";
import AddNewProduct from "./AddNewProduct";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";

const ManageProducts = () => {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [page, setPage] = React.useState<number>(1);
  const [open, setOpen] = React.useState<boolean>(false);
  const [limit] = React.useState<number>(9);
  const [total, setTotal] = React.useState<number>(0);
  const [reload, setReload] = React.useState<number>(0);

  const [selectedId, setSelectedId] = React.useState<string | undefined>();

  const refresh = () => setReload((current) => current + 1);

  useEffect(() => {
    api<PageResult<Product>>(`/products?page=${page}&limit=${limit}`)
      .then((result) => {
        if (result.items.length === 0 && page > 1) {
          setPage(page - 1);
          return;
        }
        setProducts(result.items);
        setTotal(result.pagination.total);
        setError(null);
      })
      .catch((e) => setError(e.message));
  }, [page, limit, reload]);

  const onOpenModal = (id?: string) => {
    setSelectedId(id);
    setOpen(true);
  };
  const onCloseModal = () => {
    setOpen(false);
    setSelectedId(undefined);
  };

  return (
    <div className="container mt-10">
      <button
        type="button"
        className="btn btn-primary mb-6"
        onClick={() => onOpenModal()}
      >
        Add new product
      </button>

      <Modal open={open} onClose={onCloseModal} center>
        <AddNewProduct
          onCreated={() => {
            onCloseModal();
            if (page !== 1 && !selectedId) setPage(1);
            refresh();
          }}
          id={selectedId}
        />
      </Modal>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            {...product}
            openModal={onOpenModal}
            onDeleted={refresh}
          />
        ))}
      </div>
      <Pagination
        currentPage={page}
        limit={limit}
        total={total}
        onPageChange={(p) => {
          setPage(p);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    </div>
  );
};

export default ManageProducts;
