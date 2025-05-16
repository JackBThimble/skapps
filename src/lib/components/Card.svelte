<script lang="ts">
    let { title, description, href, img, alt, cardClass, figClass, imgClass} = $props();

</script>

<a href={href}>
<div class="card card-border border-accent bg-base-100 w-full shadow-sm">
  <figure class="{figClass} border-b-1 border-accent/10">
    <img
      class="{imgClass.length > 0 ? imgClass : 'object-cover w-full bg-transparent'} max-h-96 min-h-96 object-fit"
      src="{img}"
      alt={alt} />
  </figure>
  <div class="card-body {cardClass} text-base-content">
    <h2 class="card-title">{title}</h2>
    <p>{description}</p>
    <div class="card-actions justify-end">
    </div>
  </div>
</div>
</a>