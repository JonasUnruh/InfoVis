from flask import Flask, render_template
import json
import pandas as pd

app = Flask(__name__)

# ensure that we can reload when we change the HTML / JS for debugging
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
app.config['TEMPLATES_AUTO_RELOAD'] = True



@app.route('/')
def data():
    cleaned_df_player_stats = pd.read_csv("./static/data/cleaned_df_player_stats.csv")
    df_agg_player = pd.read_csv("./static/data/df_agg_player.csv")
    df_agg_team = pd.read_csv("./static/data/df_agg_team.csv")

    cleaned_json = json.loads(cleaned_df_player_stats.to_json())
    player_json = json.loads(df_agg_player.to_json())
    team_json = json.loads(df_agg_team.to_json())
    
    # replace this with the real data
    testData = [cleaned_json, player_json, team_json]

    # return the index file and the data
    return render_template("index.html", data=json.dumps(testData))


if __name__ == '__main__':
    app.run()
