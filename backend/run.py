from app import create_app

app = create_app()

if __name__ == '__main__':
    # port 5000 adalah default Flask
    app.run(debug=True, port=5000)