# ImportCalculator

A web-based tool for calculating and distributing import costs across products. Built with React, Vite, and Tailwind CSS.

## Features

The interface is divided into four input tables:

- **Products** – Enter one or more products to be imported
- **Freight** – Shipping and logistics costs
- **Import** – Customs duties, tariffs, and import fees
- **Domestic Expenses** – Local handling, storage, and delivery costs

A final **summary table** displays the total costs broken down into base costs and taxes, as well as the **cost per unit**.

### Multi-Product Mode

When more than one product is entered, the app automatically switches to **multi-product mode**, which unlocks two additional columns:

- **Unit of Measure** – All products must use the same unit (e.g. kg, tonnes, m²)
- **Distribution Method** – Defines how total costs are allocated across products:
  - By **purchase value**
  - By **unit of measure**
  - By **quantity**

## Tech Stack

- [React 19](https://react.dev/)
- [Vite](https://vite.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
