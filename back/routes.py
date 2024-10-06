from flask import Flask, request, jsonify
from flask_cors import CORS
from back.app import app, db
from back.models import Bill, Order,Worker, Amount, Daily_Expenses, Worker_Expense
from datetime import datetime, timedelta
import json
import requests
from sqlalchemy import func



@app.route('/api/new-bill', methods=['POST'])
def new_bill():
    try:
        data = request.get_json()

        # Parse dates
        def parse_date(date_str):
            return datetime.strptime(date_str, '%Y-%m-%d').date() if date_str else None

        # Extract data from the form
        customer_name = data.get('customerName')
        mobile_number = data.get('mobileNo')
        date_issue = parse_date(data.get('dateIssue'))
        delivery_date = parse_date(data.get('deliveryDate'))
        today_date = parse_date(data.get('todayDate'))
        due_date = parse_date(data.get('dueDate'))

        garment_type = data.get('garmentType')
        suit_qty = data.get('suitQty', 0)
        safari_qty = data.get('safariQty', 0)
        pant_qty = data.get('pantQty', 0)
        shirt_qty = data.get('shirtQty', 0)
        total_qty = data.get('totalQty', 0)
        total_amt = data.get('totalAmt', 0.0)
        payment_mode = data.get('paymentMode')
        payment_status = data.get('paymentStatus')
        payment_amount = data.get('paymentAmount', 0.0)

        # Pant measurements
        pant_length = data.get('pantLength')
        pant_kamar = data.get('pantKamar')
        pant_hips = data.get('pantHips')
        pant_waist = data.get('pantWaist')
        pant_ghutna = data.get('pantGhutna')
        pant_bottom = data.get('pantBottom')
        pant_seat = data.get('pantSeat')

        # Shirt measurements
        shirt_length = data.get('shirtLength')
        shirt_body = data.get('shirtBody')
        shirt_loose = data.get('shirtLoose')
        shirt_shoulder = data.get('shirtShoulder')
        shirt_astin = data.get('shirtAstin')
        shirt_collar = data.get('shirtCollar')
        shirt_aloose = data.get('shirtAloose')

        # Extra measurements
        extra_measurements = data.get('extraMeasurements')

        # Check if the customer already exists by mobile number
        existing_bill = Bill.query.filter_by(mobile_number=mobile_number).first()

        if existing_bill:
            # Update the existing record
            existing_bill.customer_name = customer_name
            existing_bill.date_issue = date_issue
            existing_bill.delivery_date = delivery_date
            existing_bill.garment_type = garment_type
            existing_bill.suit_qty = suit_qty
            existing_bill.safari_qty = safari_qty
            existing_bill.pant_qty = pant_qty
            existing_bill.shirt_qty = shirt_qty
            existing_bill.total_qty = total_qty
            existing_bill.today_date = today_date
            existing_bill.due_date = due_date
            existing_bill.total_amt = total_amt
            existing_bill.payment_mode = payment_mode
            existing_bill.payment_status = payment_status
            existing_bill.payment_amount = payment_amount

            # Update pant measurements
            existing_bill.pant_length = pant_length
            existing_bill.pant_kamar = pant_kamar
            existing_bill.pant_hips = pant_hips
            existing_bill.pant_waist = pant_waist
            existing_bill.pant_ghutna = pant_ghutna
            existing_bill.pant_bottom = pant_bottom
            existing_bill.pant_seat = pant_seat

            # Update shirt measurements
            existing_bill.shirt_length = shirt_length
            existing_bill.shirt_body = shirt_body
            existing_bill.shirt_loose = shirt_loose
            existing_bill.shirt_shoulder = shirt_shoulder
            existing_bill.shirt_astin = shirt_astin
            existing_bill.shirt_collar = shirt_collar
            existing_bill.shirt_aloose = shirt_aloose

            # Update extra measurements
            existing_bill.extra_measurements = extra_measurements

            db.session.commit()

            return jsonify({'message': 'Customer data updated successfully', 'bill_id': existing_bill.id}), 200
        else:
            # Create a new bill if no existing record is found
            new_bill = Bill(
                customer_name=customer_name,
                mobile_number=mobile_number,
                date_issue=date_issue,
                delivery_date=delivery_date,
                garment_type=garment_type,
                suit_qty=suit_qty,
                safari_qty=safari_qty,
                pant_qty=pant_qty,
                shirt_qty=shirt_qty,
                total_qty=total_qty,
                today_date=today_date,
                due_date=due_date,
                total_amt=total_amt,
                payment_mode=payment_mode,
                payment_status=payment_status,
                payment_amount=payment_amount,
                pant_length=pant_length,
                pant_kamar=pant_kamar,
                pant_hips=pant_hips,
                pant_waist=pant_waist,
                pant_ghutna=pant_ghutna,
                pant_bottom=pant_bottom,
                pant_seat=pant_seat,
                shirt_length=shirt_length,
                shirt_body=shirt_body,
                shirt_loose=shirt_loose,
                shirt_shoulder=shirt_shoulder,
                shirt_astin=shirt_astin,
                shirt_collar=shirt_collar,
                shirt_aloose=shirt_aloose,
                extra_measurements=extra_measurements
            )

            db.session.add(new_bill)
            db.session.commit()

            new_order = Order(
                garment_type=garment_type,
                quantity=total_qty,
                status='Pending',
                order_date=datetime.now().date(),
                due_date=due_date,
                payment_mode=payment_mode,
                payment_status=payment_status,
                payment_amount=payment_amount,
                bill_id=new_bill.id
            )

            db.session.add(new_order)
            db.session.commit()

            return jsonify({'message': 'Bill and order created successfully', 'bill_id': new_bill.id}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500


    


@app.route('/api/orders', methods=['GET'])
def get_orders():
    try:
        # Fetch all orders from the database
        orders = Order.query.all()

        # Create a dictionary to group orders by delivery date
        grouped_orders = {}

        for order in orders:
            # Format the delivery date as a string
            delivery_date = order.due_date.strftime('%Y-%m-%d')

            # If this delivery date is not in the dictionary, add it
            if delivery_date not in grouped_orders:
                grouped_orders[delivery_date] = []

            # Append the order details to the corresponding delivery date
            grouped_orders[delivery_date].append({
                'id': order.id,
                'garment_type': order.garment_type,
                'quantity': order.quantity,
                'status': order.status,
                'order_date': order.order_date.strftime('%Y-%m-%d'),  # Format date as string
                'due_date': order.due_date.strftime('%Y-%m-%d'),  # Format date as string
                'payment_mode': order.payment_mode,
                'payment_status': order.payment_status,
                'payment_amount': order.payment_amount,
                'bill_id': order.bill_id,
                'worker_id': order.worker_id,
                'Work_pay':order.Work_pay
            })
            
            

        # Return the grouped orders as JSON
        return jsonify(grouped_orders), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    
    
@app.route('/api/orders/<int:order_id>/status', methods=['PUT'])
def update_order_status(order_id):
    try:
        data = request.get_json()
        status = data.get('status')

        order = Order.query.get(order_id)
        if not order:
            return jsonify({'error': 'Order not found'}), 404

        order.status = status
        db.session.commit()

        return jsonify({'message': 'Order status updated successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/orders/<int:order_id>/payment-status', methods=['PUT'])
def update_payment_status(order_id):
    try:
        data = request.get_json()
        payment_status = data.get('payment_status')

        order = Order.query.get(order_id)
        if not order:
            return jsonify({'error': 'Order not found'}), 404

        order.payment_status = payment_status
        db.session.commit()

        return jsonify({'message': 'Payment status updated successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/workers', methods=['POST'])
def add_worker():
    try:
        # Get the list of worker details from the request body
        data = request.get_json()

        if not isinstance(data, list):
            return jsonify({'error': 'Invalid input, expected a list of workers'}), 400

        workers_added = []

        # Iterate over the list of workers
        for worker_data in data:
            name = worker_data.get('name')
            number = worker_data.get('number')  # Corrected field from 'mobile' to 'number'
            Rate = worker_data.get('Rate')
            Suit = worker_data.get('Suit')
            Jacket = worker_data.get('Jacket')
            Sadri = worker_data.get('Sadri')
            Others = worker_data.get('Others')

            if not name or not number:
                return jsonify({'error': 'Name and number are required fields for all workers'}), 400

            # Create a new Worker object for each worker
            new_worker = Worker(
                name=name, 
                number=number, 
                Rate=Rate, 
                Suit=Suit, 
                Jacket=Jacket, 
                Sadri=Sadri, 
                Others=Others
            )

            # Add the new worker to the database
            db.session.add(new_worker)
            db.session.commit()

            # Add worker to the result list
            workers_added.append({
                'id': new_worker.id,
                'name': new_worker.name,
                'number': new_worker.number,
                'Rate' : new_worker.Rate,
                'Suit' : new_worker.Suit,
                'Jacket' : new_worker.Jacket,
                'Sadri' : new_worker.Sadri,
                'Others' : new_worker.Others
            })

        # Return a success message with the details of all added workers
        return jsonify({'message': 'Workers added successfully', 'workers': workers_added}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

    
@app.route('/api/workers/<int:id>', methods=['DELETE'])
def delete_worker(id):
    try:
        # Find the worker by ID
        worker = Worker.query.get(id)

        if not worker:
            return jsonify({'error': 'Worker not found'}), 404

        # Delete the worker from the database
        db.session.delete(worker)
        db.session.commit()

        return jsonify({'message': f'Worker {worker.name} removed successfully'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/api/workers', methods=['GET'])
def get_workers():
    try:
        # Fetch all workers from the database
        workers = Worker.query.all()

        # Create a list to hold the workers' data
        worker_list = []

        for worker in workers:
            # Append worker details to the list
            worker_list.append({
                'id': worker.id,
                'name': worker.name,
                'number': worker.number,
                'Rate' : worker.Rate,
                'Suit' : worker.Suit,
                'Jacket' : worker.Jacket,
                'Sadri' : worker.Sadri,
                'Others' :worker.Others
            })

        # Return the list of workers as JSON
        return jsonify(worker_list), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
        

@app.route('/api/orders/<int:order_id>/assign-worker', methods=['PUT'])
def assign_worker(order_id):
    try:
        data = request.get_json()
        worker_id = data.get('worker_id')  # Use worker_id as per the previous route

        # Fetch the order by ID
        order = Order.query.get(order_id)

        if not order:
            return jsonify({'error': 'Order not found'}), 404

        # Fetch the worker by ID
        worker = Worker.query.get(worker_id)

        if not worker:
            return jsonify({'error': 'Worker not found'}), 404

        # Calculate Work_pay based on garment type
        work_pay = 0.0
        if order.garment_type == 'Suit':
            work_pay = worker.Suit * order.quantity
        elif order.garment_type == 'Jacket':
            work_pay = worker.Jacket * order.quantity
        elif order.garment_type == 'Sadri':
            work_pay = worker.Sadri * order.quantity
        elif order.garment_type == 'Others':
            work_pay = worker.Others * order.quantity
        else:
            work_pay = worker.Rate * order.quantity  # Default rate if no garment-specific rate

        # Assign worker to the order and update work pay
        order.worker_id = worker_id
        order.Work_pay = work_pay

        db.session.commit()

        return jsonify({'success': True, 'work_pay': work_pay}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

        

# @app.route('/api/orders/<int:order_id>/assign-worker', methods=['PUT'])
# def assign_worker(order_id):
#     try:
#         data = request.get_json()
#         worker_id = data.get('worker_id')

#         # Fetch the order by ID
#         order = Order.query.get(order_id)

#         if not order:
#             return jsonify({'error': 'Order not found'}), 404

#         # Assign the worker to the order
#         order.worker_id = worker_id
#         db.session.commit()

#         return jsonify({'success': True}), 200

#     except Exception as e:
#         return jsonify({'error': str(e)}), 500


# @app.route('/api/worker-expense', methods=['GET'])
# def get_worker_expense():
#     try:
#         # Query all worker expenses
#         worker_expenses = Worker_Expense.query.all()

#         # Prepare the data to send to the frontend
#         expense_list = [
#             {
#                 'id': expense.id,
#                 'date': expense.date.strftime('%Y-%m-%d'),
#                 'name': expense.name,
#                 'Amt_Paid': expense.Amt_Paid,
#                 'worker_id': expense.worker_id
#             }
#             for expense in worker_expenses
#         ]

#         return jsonify(expense_list), 200

#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

# @app.route('/api/worker-expense', methods=['POST'])
# def add_worker_expense():
#     data = request.get_json()
    
#     worker_id = data.get('worker_id')
#     date = data.get('date')
#     amt_paid = data.get('Amt_Paid')

#     if not worker_id or not date or not amt_paid:
#         return jsonify({'error': 'Missing data'}), 400

#     # Create a new Worker_Expense entry
#     new_expense = Worker_Expense(
#         worker_id=worker_id,
#         date=date,
#         Amt_Paid=amt_paid
#     )

#     try:
#         db.session.add(new_expense)
#         db.session.commit()
#         return jsonify({'message': 'Worker expense added successfully'}), 201
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({'error': str(e)}), 500


@app.route('/api/worker-expense', methods=['POST'])
def add_worker_expense():
    data = request.get_json()

    worker_id = data.get('worker_id')
    date_str = data.get('date')
    amt_paid = data.get('Amt_Paid')
    name=data.get('name')

    if not worker_id or not date_str or not amt_paid or not name:
        return jsonify({'error': 'Missing data'}), 400

    try:
        # Convert date string to Python date object
        expense_date = datetime.strptime(date_str, '%Y-%m-%d').date()

        # Ensure amt_paid is a float
        amt_paid = float(amt_paid)
    except ValueError as e:
        return jsonify({'error': f'Invalid data format: {e}'}), 400

    # Create a new Worker_Expense entry
    new_expense = Worker_Expense(
        worker_id=worker_id,
        date=expense_date,
        Amt_Paid=amt_paid,
        name=name
    )

    try:
        db.session.add(new_expense)
        db.session.commit()
        return jsonify({'message': 'Worker expense added successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    

@app.route('/api/worker-weekly-pay', methods=['GET'])
def worker_weekly_pay():
    try:
        # Get worker expenses
        worker_expense_response = requests.get('http://127.0.0.1:5000/api/worker-expense')
        worker_expense_data = worker_expense_response.json()

        # Get orders with Work_pay
        orders_response = requests.get('http://127.0.0.1:5000/api/orders')
        orders_data = orders_response.json()

        # Create a dictionary to store the total Amt_paid for each worker
        worker_expense_totals = {}

        # Calculate total Amt_paid per worker from worker-expense API
        for expense in worker_expense_data:
            worker_id = expense['worker_id']
            amt_paid = expense['Amt_paid']

            if worker_id in worker_expense_totals:
                worker_expense_totals[worker_id] += amt_paid
            else:
                worker_expense_totals[worker_id] = amt_paid

        # Create a dictionary to store the final weekly pay calculations
        worker_weekly_pay_data = {}

        # Calculate the remaining pay by subtracting Amt_paid from Work_pay for each worker
        for order in orders_data:
            worker_id = order['worker_id']
            work_pay = order['Work_pay']

            # Ensure the worker has a recorded expense in worker_expense_totals
            amt_paid = worker_expense_totals.get(worker_id, 0)

            # Calculate the remaining pay
            remaining_pay = work_pay - amt_paid

            # Store the results
            worker_weekly_pay_data[worker_id] = {
                'worker_id': worker_id,
                'work_pay': work_pay,
                'amt_paid': amt_paid,
                'remaining_pay': remaining_pay
            }

        return jsonify(worker_weekly_pay_data), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Route for Shop Expense for both GET and POST methods


# @app.route('/api/daily_expenses', methods=['GET'])
# def get_daily_expenses():
#     try:
#         # Fetch all daily expenses from the database
#         expenses = Daily_Expenses.query.all()

#         # Create a list to store the expense data
#         expense_list = []
#         for expense in expenses:
#             expense_list.append({
#                 'id': expense.id,
#                 'Date': expense.Date.strftime('%Y-%m-%d'),  # Format the date properly
#                 'material_cost': expense.material_cost,
#                 'material_type': expense.material_type,
#                 'miscellaneous_Cost': expense.miscellaneous_Cost,
#                 'miscellaenous_item': expense.miscellaenous_item,
#                 'chai_pani_cost': expense.chai_pani_cost,
#                 'worker_id': expense.worker_id,
#                 'Total_Pay': expense.Total_Pay
#             })

#         # Return the list of expenses as a JSON response
#         return jsonify(expense_list), 200

#     except Exception as e:
#         return jsonify({'error': str(e)}), 500
    

@app.route('/api/daily_expenses', methods=['POST'])
def add_daily_expense():
    try:
        # Get data from the request body
        data = request.get_json()

        # Extract fields from the JSON data
        date = data.get('Date')
        material_cost = data.get('material_cost')
        material_type = data.get('material_type')
        miscellaneous_cost = data.get('miscellaneous_Cost')
        miscellaneous_item = data.get('miscellaenous_item')
        chai_pani_cost = data.get('chai_pani_cost')
        

        # Check if mandatory fields are provided
        if not date :
            return jsonify({'error': 'Date is a required field.'}), 400

        # Create a new Daily_Expenses object
        new_expense = Daily_Expenses(
            Date=datetime.strptime(date, '%Y-%m-%d'),  # Convert string to date
            material_cost=material_cost,
            material_type=material_type,
            miscellaneous_Cost=miscellaneous_cost,
            miscellaenous_item=miscellaneous_item,
            chai_pani_cost=chai_pani_cost
        )

        # Add the new expense to the database
        db.session.add(new_expense)
        db.session.commit()

        # Return success message
        return jsonify({'message': 'Expense added successfully!'}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# @app.route('/update_total_pay', methods=['POST'])
# def update_total_pay():
#     try:
#         # Fetch all daily expenses
#         daily_expenses = Daily_Expenses.query.all()

#         for expense in daily_expenses:
#             # Fetch the sum of Amt_Paid from Worker_Expense where date and worker_id match
#             total_amt_paid = db.session.query(func.sum(Worker_Expense.Amt_Paid))\
#                 .filter(Worker_Expense.date == expense.Date, Worker_Expense.worker_id == expense.worker_id)\
#                 .scalar() or 0.0

#             # Calculate total pay: material_cost + miscellaneous_Cost + chai_pani_cost + total_amt_paid
#             total_pay = (expense.material_cost or 0) + (expense.miscellaneous_Cost or 0) + (expense.chai_pani_cost or 0) + total_amt_paid

#             # Update the Total_Pay column in Daily_Expenses
#             expense.Total_Pay = total_pay

#         # Commit changes to the database
#         db.session.commit()

#         return jsonify({'message': 'Total Pay updated successfully'}), 200

#     except Exception as e:
#         db.session.rollback()
#         return jsonify({'error': str(e)}), 500





# new stuff



from sqlalchemy import func


@app.route('/update_total_pay', methods=['POST'])
def update_total_pay():
    # Fetch all daily expenses
    daily_expenses = Daily_Expenses.query.all()

    for expense in daily_expenses:
        # Fetch the sum of Amt_Paid from Worker_Expense where date and worker_id match
        total_amt_paid = db.session.query(func.sum(Worker_Expense.Amt_Paid)).filter(Worker_Expense.date == expense.Date).scalar() or 0.0
        
        #     .scalar() or 0.0
        
        # .scalar() or 0.0
        

        
        print(f"Worker ID: {expense.worker_id}, Date: {expense.Date}, Total Amt Paid: {total_amt_paid}")

        # Calculate total pay: material_cost + miscellaneous_Cost + chai_pani_cost + total_amt_paid
        total_pay = (expense.material_cost or 0) + (expense.miscellaneous_Cost or 0) + (expense.chai_pani_cost or 0) + total_amt_paid
        
        # Update the Total_Pay column in Daily_Expenses
        expense.Total_Pay = total_pay

    # Commit changes to the database
    db.session.commit()

    return jsonify({'message': 'Total Pay updated successfully'})



@app.route('/api/daily_expenses', methods=['GET'])
def get_daily_expenses():
    expenses = Daily_Expenses.query.all()

    # Serialize the data for JSON response
    expenses_data = []
    for expense in expenses:
        expenses_data.append({
            'id': expense.id,
            'Date': expense.Date,
            'material_cost': expense.material_cost,
            'material_type': expense.material_type,
            'miscellaneous_Cost': expense.miscellaneous_Cost,
            'miscellaenous_item': expense.miscellaenous_item,
            'chai_pani_cost': expense.chai_pani_cost,
            'worker_id': expense.worker_id,
            'Total_Pay': expense.Total_Pay
        })

    return jsonify(expenses_data)

# Route for customer info section

@app.route('/api/customer-info/<mobile_number>', methods=['GET', 'PUT'])
def get_customer_info(mobile_number):
    customer_orders = Bill.query.filter_by(mobile_number=mobile_number).all()

    if not customer_orders:
        return jsonify({"error": "No orders found for this customer"}), 404

    # Get the measurements from the first order
    measurements = {
        "length": customer_orders[0].pant_length,
        "pant_kamar": customer_orders[0].pant_kamar,
        "pant_hips": customer_orders[0].pant_hips,
        "pant_waist": customer_orders[0].pant_waist,
        "pant_ghutna": customer_orders[0].pant_ghutna,
        "pant_bottom": customer_orders[0].pant_bottom,
        "pant_seat": customer_orders[0].pant_seat,
        "shirt_length": customer_orders[0].shirt_length,
        "shirt_body": customer_orders[0].shirt_body,
        "shirt_loose": customer_orders[0].shirt_loose,
        "shirt_shoulder": customer_orders[0].shirt_shoulder,
        "shirt_astin": customer_orders[0].shirt_astin,
        "shirt_collar": customer_orders[0].shirt_collar,
        "shirt_aloose": customer_orders[0].shirt_aloose,
        "extra_measurements": customer_orders[0].extra_measurements
    }

    order_history = [order.as_dict() for order in customer_orders]

    customer_info = {
        "measurements": measurements,
        "order_history": order_history,
        "customer_name": customer_orders[0].customer_name,
        "mobile_number": mobile_number
    }

    if request.method == 'PUT':
        # Update measurements based on incoming JSON data
        data = request.get_json()
        for key in measurements.keys():
            if key in data:
                setattr(customer_orders[0], key, data[key])  # Update the measurement
        db.session.commit()  # Commit the changes to the database
        return jsonify({"message": "Measurements updated successfully"}), 200

    return jsonify(customer_info), 200


@app.route('/api/weekly-pay/<int:worker_id>', methods=['GET'])
def calculate_weekly_pay(worker_id):
    try:
        # Get the date for 7 days ago
        one_week_ago = datetime.now() - timedelta(days=7)
        
        # Fetch and sum worker_pay from orders for the last 7 days for the given worker
        var1 = db.session.query(func.sum(Order.Work_pay)).filter(
            Order.worker_id == worker_id,
            Order.order_date >= one_week_ago
        ).scalar() or 0  # default to 0 if no records
        
        # Fetch and sum amt_paid from Worker_Expense for the last 7 days for the given worker
        var2 = db.session.query(func.sum(Worker_Expense.Amt_Paid)).filter(
            Worker_Expense.worker_id == worker_id,
            Worker_Expense.date >= one_week_ago
        ).scalar() or 0  # default to 0 if no records

        # Calculate remaining pay
        remaining_pay = var1 - var2

        return jsonify({
            'worker_id': worker_id,
            'total_worker_pay': var1,
            'total_amt_paid': var2,
            'remaining_pay': remaining_pay
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    


@app.route('/api/orders', methods=['GET'])
def get_orders_by_worker():
    try:
        # Get the worker_id from the query parameters
        worker_id = request.args.get('worker_id', type=int)

        if not worker_id:
            return jsonify({'error': 'Worker ID is required'}), 400

        # Query the orders associated with the given worker_id
        orders = Order.query.filter_by(worker_id=worker_id).all()

        if not orders:
            return jsonify([]), 200

        # Serialize the orders into a format suitable for JSON response
        orders_data = []
        for order in orders:
            orders_data.append({
                'id': order.id,
                'customer_name': order.customer_name,
                'order_date': order.order_date.strftime('%Y-%m-%d'),
                'amount': order.amount
            })

        return jsonify(orders_data), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500



        
if __name__ == "__main__":
    app.run(debug=True)
