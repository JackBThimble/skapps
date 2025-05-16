<script lang="ts">
    import Card from '$lib/components/Card.svelte';
    import todos_img from '$lib/images/todos.jpg'
    import weather_img from '$lib/images/weather.jpg'
    import img_2048 from '$lib/images/2048.png';
    import chat_img from '$lib/images/chat.jpg';
    import notes_img from '$lib/images/notes.jpg';
    import calc_img from '$lib/images/calc.jpg'
</script>

<div class="flex flex-wrap gap-4 justify-center items-center w-3/4 mx-auto mt-10">
    <Card title="Todos" description="A simple todo application" img={todos_img} href="/todos" alt="Todos img" figClass="" imgClass="" cardClass="" />
    <Card title="Weather" description="A simple weather application" href="/weather" img={weather_img} alt="Weather img" figClass="" imgClass="" cardClass=""/>
    <Card title="2048" description="A simple 2048 game" href="/2048" img={img_2048} alt="2048 img" figClass="bg-gradient-to-tl from-teal-300 via-gray-900 to-pink-500" cardClass="" imgClass=""/>

    <Card title="Chat" description="A simple chat application" href="/chat" img={chat_img} alt="chat img" figClass="" imgClass="" cardClass=""/>
    <Card title="Notes" description="A simple notes application" href="/notes" img={notes_img} alt="Notes img" figClass="" imgClass="" cardClass=""/>
    <Card title="Calculator" description="A simple calculator application" href="/calculator" img={calc_img} alt="Calculator img" figClass="" imgClass="" cardClass="" />
</div>