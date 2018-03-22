class Logger:
    def __init__(self):
        self.messages = []

    def log(self, message):
        self.messages.append(message)

    def print_messages(self):
        i = 1
        for message in self.messages:
            print(str(i) + ". " + message)
            i += 1
