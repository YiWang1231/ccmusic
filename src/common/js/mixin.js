import { mapGetters, mapMutations, mapActions } from 'vuex'
import { playMode } from "@/common/js/config";
import { shuffle } from "@/common/js/util";

export const playlistMixin = {
    computed: {
        ...mapGetters([
            'playList'
        ])
    },
    mounted() {
        this.handlePlaylist(this.playList)
    },
    activated() {
        this.handlePlaylist(this.playList)
    },
    watch: {
        playList(newVal) {
            this.handlePlaylist(newVal)
        }
    },
    methods: {
        handlePlaylist() {
            throw new Error('component must implement handlePlaylist method')
        }
    }
}

export const playerMixin = {
    computed: {
        iconMode() {
            return this.mode === playMode.sequence
                ? `icon-sequence`
                : this.mode === playMode.loop
                    ? `icon-loop`
                    : `icon-random`;
        },
        ...mapGetters(["sequenceList", "currentSong", "playList", "mode", "likeList"]),
    },
    methods: {
        ...mapMutations({
            setCurrentIndex: "SET_CURRENT_INDEX",
            setPlayMode: "SET_PLAY_MODE",
            setPlayList: "SET_PLAY_LIST"
        }),
        ...mapActions(['saveLikeSong', 'unLikeSong']),
        toggleLike(song) {
            console.log(this.isLike(song))
            return this.isLike(song) ? this.unLikeSong(song) : this.saveLikeSong(song)
        },
        getLikeIcon(song) {
            return this.isLike(song) ? 'icon-favorite' : 'icon-not-favorite'
        },
        isLike(song) {
            let index = this.likeList.findIndex((item) => {
                return item.id === song.id
            })
            return index > -1
        },
        changeMode() {
            // pretty tricky！！！！
            const mode = (this.mode + 1) % 3;
            this.setPlayMode(mode);
            let list = null;
            if (mode === playMode.random) {
                list = shuffle(this.sequenceList);
            } else {
                list = this.sequenceList;
            }
            this._resetCurrentIndex(list);
            this.setPlayList(list);
        },
        _resetCurrentIndex(list) {
            let index = list.findIndex(item => {
                // ID是歌曲判断标识
                return item.id === this.currentSong.id;
            });
            this.setCurrentIndex(index);
        },
    }

}

export const searchMixin = {
    data() {
        return {
            query: "",
            refreshDelay: 100
        }
    },
    computed: {
        ...mapGetters([
            'searchHistory'
        ])
    },
    methods: {
        onQueryChange(query) {
            this.query = query;
        },
        blurInput() {
            this.$refs.searchBox.blur();
        },
        addQuery(query) {
            this.$refs.searchBox.setQuery(query);
        },
        saveSearch() {
            this.saveSearchHistory(this.query);
        },
        ...mapActions([
            'saveSearchHistory',
            "deleteSearchHistory",
        ])
    }
}