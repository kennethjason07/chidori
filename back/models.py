from datetime import date
from back.app import db

class Bill(db.Model):
    __tablename__ = 'bills'
    id = db.Column(db.Integer, primary_key=True)
    customer_name = db.Column(db.String(100), nullable=False)
    mobile_number = db.Column(db.String(15), nullable=False)
    date_issue = db.Column(db.Date, nullable=False)
    delivery_date = db.Column(db.Date, nullable=False)
    garment_type = db.Column(db.String(50), nullable=False)
    suit_qty = db.Column(db.Integer, default=0)
    safari_qty = db.Column(db.Integer, default=0)
    pant_qty = db.Column(db.Integer, default=0)
    shirt_qty = db.Column(db.Integer, default=0)
    total_qty = db.Column(db.Integer, default=0)
    today_date = db.Column(db.Date, nullable=False)
    due_date = db.Column(db.Date, nullable=False)
    total_amt = db.Column(db.Float, nullable=False)
    payment_mode = db.Column(db.String(50), nullable=False)
    payment_status = db.Column(db.String(50), nullable=False)
    payment_amount = db.Column(db.Float, nullable=False)

    pant_length = db.Column(db.Float)
    pant_kamar = db.Column(db.Float)
    pant_hips = db.Column(db.Float)
    pant_waist = db.Column(db.Float)
    pant_ghutna = db.Column(db.Float)
    pant_bottom = db.Column(db.Float)
    pant_seat = db.Column(db.Float)

    shirt_length = db.Column(db.Float)
    shirt_body = db.Column(db.Float)
    shirt_loose = db.Column(db.Float)
    shirt_shoulder = db.Column(db.Float)
    shirt_astin = db.Column(db.Float)
    shirt_collar = db.Column(db.Float)
    shirt_aloose = db.Column(db.Float)

    extra_measurements = db.Column(db.Text)

    # Relationship with orders
    orders = db.relationship('Order', backref='bill', lazy=True)

    # Method to convert Bill to dictionary
    def as_dict(self):
        return {
            'id': self.id,
            'customer_name': self.customer_name,
            'mobile_number': self.mobile_number,
            'date_issue': self.date_issue.isoformat() if self.date_issue else None,
            'delivery_date': self.delivery_date.isoformat() if self.delivery_date else None,
            'garment_type': self.garment_type,
            'suit_qty': self.suit_qty,
            'safari_qty': self.safari_qty,
            'pant_qty': self.pant_qty,
            'shirt_qty': self.shirt_qty,
            'total_qty': self.total_qty,
            'today_date': self.today_date.isoformat() if self.today_date else None,
            'due_date': self.due_date.isoformat() if self.due_date else None,
            'total_amt': self.total_amt,
            'payment_mode': self.payment_mode,
            'payment_status': self.payment_status,
            'payment_amount': self.payment_amount,
            'pant_length': self.pant_length,
            'pant_kamar': self.pant_kamar,
            'pant_hips': self.pant_hips,
            'pant_waist': self.pant_waist,
            'pant_ghutna': self.pant_ghutna,
            'pant_bottom': self.pant_bottom,
            'pant_seat': self.pant_seat,
            'shirt_length': self.shirt_length,
            'shirt_body': self.shirt_body,
            'shirt_loose': self.shirt_loose,
            'shirt_shoulder': self.shirt_shoulder,
            'shirt_astin': self.shirt_astin,
            'shirt_collar': self.shirt_collar,
            'shirt_aloose': self.shirt_aloose,
            'extra_measurements': self.extra_measurements
        }






class Worker(db.Model):
    __tablename__ = 'workers'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    number = db.Column(db.String(15), nullable=False)
    Rate = db.Column(db.Float, nullable=True)
    Suit = db.Column(db.Float, nullable=True)
    Jacket = db.Column(db.Float, nullable=True)
    Sadri = db.Column(db.Float, nullable=True)
    Others = db.Column(db.Float, nullable=True)
    
    # One-to-many relationship with orders
    orders = db.relationship('Order', backref='assigned_worker', lazy=True)
    daily_expenses = db.relationship('Daily_Expenses', backref='worker_expense', lazy=True)
    worker_expense = db.relationship('Worker_Expense', backref='worker', lazy=True)


class Order(db.Model):
    __tablename__ = 'orders'
    id = db.Column(db.Integer, primary_key=True)
    garment_type = db.Column(db.String(50), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(50), nullable=False)
    order_date = db.Column(db.Date, nullable=False)
    due_date = db.Column(db.Date, nullable=False)
    payment_mode = db.Column(db.String(50), nullable=False)
    payment_status = db.Column(db.String(50), nullable=False)
    payment_amount = db.Column(db.Float, nullable=False)
    Work_pay = db.Column(db.Float, nullable=True)

    # ForeignKey to Worker table (nullable)
    worker_id = db.Column(db.Integer, db.ForeignKey('workers.id'), nullable=True)

    # ForeignKey to Bill table
    bill_id = db.Column(db.Integer, db.ForeignKey('bills.id'), nullable=False)

    
class Amount(db.Model):
    __tablename__= 'GarmentAmt'
    id = db.Column(db.Integer, primary_key=True)
    Pant_Amt = db.Column(db.Float, nullable=False)
    Shirt_Amt = db.Column(db.Float, nullable=False)
    Suit_amt = db.Column(db.Float, nullable=False)
    Safari_amt = db.Column(db.Float, nullable=False)
    Sadri_amt = db.Column(db.Float, nullable=False)

class Worker_Expense(db.Model):
    __tablename__ = 'Worker_Expense'
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    Amt_Paid = db.Column(db.Float, nullable=False)
    worker_id = db.Column(db.Integer, db.ForeignKey('workers.id'), nullable=True)

class Daily_Expenses(db.Model):
    __tablename__ = 'Daily_Expenses'  
    id = db.Column(db.Integer, primary_key=True)
    Date = db.Column(db.Date, nullable=False) 
    material_cost = db.Column(db.Float, nullable=True)
    material_type = db.Column(db.String(1000), nullable=True)
    miscellaneous_Cost = db.Column(db.Float, nullable=True)
    miscellaenous_item = db.Column(db.String(1000), nullable=True)
    chai_pani_cost = db.Column(db.Float, nullable=True)
    worker_id = db.Column(db.Integer, db.ForeignKey('workers.id'), nullable=True)
    Total_Pay = db.Column(db.Float, nullable=True)