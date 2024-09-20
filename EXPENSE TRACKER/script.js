document.addEventListener('DOMContentLoaded', function () {
    const app = {
        amount: '',
        to: '',
        info: '',
        date: '',
        total: 0,
        expenses: [],
        
        init: function () {
            this.loadExpenses();
            this.updateTotal();
            document.querySelector('.form').addEventListener('submit', this.addExpense.bind(this));
            document.querySelector('.btn_danger').addEventListener('click', this.clearExpenses.bind(this));
            document.querySelector('.btn_primary').addEventListener('click', this.getCsv.bind(this));
        },

        addExpense: function (event) {
            event.preventDefault();
            
            // Update this to read values from the form inputs
            this.amount = parseFloat(document.getElementById('amount').value) || '';
            this.to = document.getElementById('to').value;
            this.info = document.getElementById('note').value;
            this.date = document.getElementById('date').value;
        
            if (this.checkForm()) {
                alert("Please fill in all fields.");
                return;
            }
        
            const data = {
                amount: this.amount,
                to: this.to,
                info: this.info,
                date: this.date
            };
        
            this.expenses.unshift(data);
            this.saveExpenses();
            this.resetForm();
            this.updateTotal();
            this.renderExpenses();
        },
        

        clearExpenses: function () {
            this.expenses = [];
            this.total = 0;
            this.saveExpenses();
            this.renderExpenses();
        },

        updateTotal: function () {
            this.total = this.expenses.reduce((sum, expense) => sum + Math.abs(expense.amount), 0);
            document.getElementById('totalAmount').textContent = `$${this.total.toFixed(2)}`;
        },

        checkForm: function () {
            return !this.amount || !this.to || !this.info || !this.date;
        },

        getCsv: function () {
            const headers = {
                amount: "Amount",
                to: "For",
                info: "Info",
                date: "Date"
            };

            const itemsFormatted = this.expenses.map(item => ({
                amount: item.amount,
                to: item.to,
                info: item.info,
                date: item.date
            }));

            this.exportCSVFile(headers, itemsFormatted, 'Expenses');
        },

        convertToCSV: function (objArray) {
            const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
            let str = '';

            array.forEach(item => {
                const line = Object.values(item).join(',');
                str += line + '\r\n';
            });

            return str;
        },

        exportCSVFile: function (headers, items, fileTitle) {
            if (headers) {
                items.unshift(headers);
            }

            const csv = this.convertToCSV(JSON.stringify(items));
            const exportedFilenmae = fileTitle + '.csv';

            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.setAttribute("download", exportedFilenmae);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },

        loadExpenses: function () {
            const storedExpenses = localStorage.getItem('q-vue-expenses');
            this.expenses = storedExpenses ? JSON.parse(storedExpenses) : [];
            this.renderExpenses();
        },

        saveExpenses: function () {
            localStorage.setItem('q-vue-expenses', JSON.stringify(this.expenses));
        },

        resetForm: function () {
            this.amount = '';
            this.to = '';
            this.info = '';
            this.date = '';
            this.renderFormValues();
        },

        renderFormValues: function () {
            document.getElementById('amount').value = this.amount;
            document.getElementById('to').value = this.to;
            document.getElementById('note').value = this.info;
            document.getElementById('date').value = this.date;
        },

        renderExpenses: function () {
            const expenseList = document.getElementById('expenseList');
            expenseList.innerHTML = ''; // Clear existing expenses

            this.expenses.forEach(expense => {
                const expenseDiv = document.createElement('div');
                expenseDiv.className = 'expense';
                expenseDiv.innerHTML = `
                    <p class="to"><b>To:</b> ${expense.to}</p>
                    <p class="date"><b>Date:</b> ${expense.date}</p>
                    <p class="amnt"><b>Amount:</b> $${expense.amount.toFixed(2)}</p>
                    <p class="note"><b>Note:</b> ${expense.info}</p>
                `;
                expenseList.appendChild(expenseDiv);
            });
        }
    };

    app.init();
});
