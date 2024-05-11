from flask import Flask, render_template
import json
import pandas as pd
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler, MinMaxScaler

app = Flask(__name__)

# ensure that we can reload when we change the HTML / JS for debugging
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
app.config['TEMPLATES_AUTO_RELOAD'] = True



@app.route('/')
def data():
    # load  csv data
    cleaned_df_player_stats = pd.read_csv("./static/data/cleaned_df_player_stats.csv", index_col = 0)
    df_agg_player = pd.read_csv("./static/data/df_agg_player.csv", index_col = 0)
    df_agg_team = pd.read_csv("./static/data/df_agg_team.csv", index_col = 0)

    # create json data
    cleaned_json = json.loads(cleaned_df_player_stats.to_json(orient = "records"))
    player_json = json.loads(df_agg_player.to_json(orient = "records"))
    team_json = json.loads(df_agg_team.to_json(orient = "records"))

    # get values to scale and use for PCA
    target_cols = ["Team ID", "Team Name"]
    X = df_agg_team.drop(target_cols, axis = 1)[1:]
    
    # scale data
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # perform PCA
    pca = PCA(n_components = 2)
    X_pca = pca.fit_transform(X_scaled)

    # send PCA data to client
    df_pca = pd.DataFrame(data = X_pca, columns = ["X1", "X2"])
    df_pca = pd.concat([df_pca, df_agg_team[target_cols][1:].reset_index()], axis = 1)

    pca_json = json.loads(df_pca.to_json(orient = "records"))
    
    # create heatmap data
    scaler = MinMaxScaler() 
    intermediate_df = df_agg_team
    intermediate_df.iloc[1:, 2:] = scaler.fit_transform(df_agg_team.iloc[1:, 2:])
    heatmap_df = pd.melt(intermediate_df[1:], id_vars = target_cols, var_name = "vars", value_name = "values")
    heatmap_json = json.loads(heatmap_df.to_json(orient = "records"))

    # replace this with the real data
    data = [pca_json, heatmap_json]

    # return the index file and the data
    return render_template("index.html", data=json.dumps(data))


if __name__ == '__main__':
    app.run()
    