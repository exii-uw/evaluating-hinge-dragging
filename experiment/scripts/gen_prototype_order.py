import random


def generate_latin_square(conditions):
    while True:
        try:
            square = []
            in_col = [set() for _ in conditions]
            for i in range(len(conditions)):
                in_row = set()
                row = []
                for j in range(len(conditions)):
                    # Get the next one
                    if len(in_row.union(in_col[j])) == len(conditions):
                        raise StopIteration
                    nxt = random.choice(conditions)
                    while nxt in in_row or nxt in in_col[j]:
                        nxt = random.choice(conditions)
                    row += [nxt]
                    in_row.add(nxt)
                    in_col[j].add(nxt)
                square += [row]
            return square
        except StopIteration:
            pass


n_squares = 8
orig = ["x1fold", "24mm", "12mm", "6mm", "1mm"]

rearranged = []
for _ in range(n_squares):
    rearranged += generate_latin_square(orig)

rearranged = [["flat"] + arr for arr in rearranged]
print(rearranged)
